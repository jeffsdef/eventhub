import { NextResponse } from 'next/server';
import type { Event, RegisterUserPayload, UpdateUserPayload } from '@/types';
import { getBearerUserId, signAccessToken } from '@/server/auth';
import { SEED_CATEGORIES, SEED_PLATFORM_STATS } from '@/server/seed-data';
import {
  createPasswordHash,
  findUserByEmail,
  findUserById,
  getStore,
  toPublicUser,
  verifyPassword,
  type StoredUser,
} from '@/server/store';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function error(message: string | string[], status: number) {
  return json({ message }, status);
}

function requireAuth(request: Request): StoredUser | NextResponse {
  const userId = getBearerUserId(request);
  if (!userId) return error('Não autorizado', 401);
  const user = findUserById(userId);
  if (!user) return error('Usuário não encontrado', 401);
  return user;
}

async function readBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export async function handleApiRequest(
  request: Request,
  path: string[],
  method: string,
): Promise<NextResponse> {
  const store = getStore();
  const route = path.join('/');

  try {
    if (method === 'POST' && route === 'auth/login') {
      const body = await readBody<{ email?: string; password?: string }>(request);
      if (!body?.email || !body?.password) {
        return error('Email e senha são obrigatórios', 400);
      }

      const user = findUserByEmail(body.email);
      if (!user || !verifyPassword(body.password, user.passwordHash)) {
        return error('Credenciais inválidas', 401);
      }

      return json({
        accessToken: signAccessToken(user.id),
        user: toPublicUser(user),
      });
    }

    if (method === 'POST' && route === 'users') {
      const body = await readBody<RegisterUserPayload>(request);
      if (!body?.name || !body?.email || !body?.password) {
        return error('Nome, email e senha são obrigatórios', 400);
      }
      if (findUserByEmail(body.email)) {
        return error('Email já cadastrado', 409);
      }

      const newUser: StoredUser = {
        id: store.nextUserId++,
        name: body.name,
        email: body.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name)}&background=2563EB&color=fff`,
        role: 'user',
        bio: 'Novo membro da comunidade EventHub.',
        eventsCreated: 0,
        eventsAttended: 0,
        rating: 5.0,
        interests: body.interests ?? [],
        passwordHash: createPasswordHash(body.password),
      };

      store.users.push(newUser);
      return json(toPublicUser(newUser), 201);
    }

    if (method === 'GET' && route === 'categories') {
      return json(SEED_CATEGORIES);
    }

    if (method === 'GET' && route === 'events') {
      return json(store.events);
    }

    if (method === 'GET' && route === 'events/featured') {
      return json(store.events.filter((event) => event.featured));
    }

    if (method === 'GET' && route.startsWith('events/') && path.length === 2) {
      const eventId = Number(path[1]);
      const event = store.events.find((item) => item.id === eventId);
      if (!event) return error('Evento não encontrado', 404);
      return json(event);
    }

    if (method === 'POST' && route === 'events') {
      const auth = requireAuth(request);
      if (auth instanceof NextResponse) return auth;

      const body = await readBody<{
        title?: string;
        description?: string;
        image?: string;
        category?: string;
        date?: string;
        time?: string;
        location?: string;
        price?: number;
        capacity?: number;
        featured?: boolean;
      }>(request);

      if (!body?.title || !body?.category || !body?.date || !body?.location) {
        return error('Campos obrigatórios ausentes', 400);
      }

      const newEvent: Event = {
        id: store.nextEventId++,
        title: body.title,
        description: body.description ?? '',
        image:
          body.image ??
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        category: body.category,
        date: body.date,
        time: body.time ?? '19:00',
        location: body.location,
        organizer: auth.name,
        organizerId: auth.id,
        price: body.price ?? 0,
        capacity: body.capacity ?? 100,
        confirmed: 0,
        status: 'upcoming',
        rating: 5.0,
        reviews: 0,
        featured: body.featured ?? false,
      };

      store.events.unshift(newEvent);
      auth.eventsCreated += 1;
      return json(newEvent, 201);
    }

    if (method === 'POST' && path[0] === 'events' && path[2] === 'confirm') {
      const auth = requireAuth(request);
      if (auth instanceof NextResponse) return auth;

      const eventId = Number(path[1]);
      const event = store.events.find((item) => item.id === eventId);
      if (!event) return error('Evento não encontrado', 404);

      const confirmed = store.confirmedByUser.get(auth.id) ?? new Set<number>();
      if (!confirmed.has(eventId)) {
        confirmed.add(eventId);
        store.confirmedByUser.set(auth.id, confirmed);
        event.confirmed = Math.min(event.confirmed + 1, event.capacity);
        auth.eventsAttended += 1;
      }

      return new NextResponse(null, { status: 204 });
    }

    if (method === 'DELETE' && path[0] === 'events' && path.length === 2) {
      const auth = requireAuth(request);
      if (auth instanceof NextResponse) return auth;

      const eventId = Number(path[1]);
      const index = store.events.findIndex((item) => item.id === eventId);
      if (index === -1) return error('Evento não encontrado', 404);

      const event = store.events[index];
      if (event.organizerId !== auth.id && auth.role !== 'admin') {
        return error('Sem permissão para excluir este evento', 403);
      }

      store.events.splice(index, 1);
      return new NextResponse(null, { status: 204 });
    }

    if (method === 'GET' && route === 'users/me') {
      const auth = requireAuth(request);
      if (auth instanceof NextResponse) return auth;
      return json(toPublicUser(auth));
    }

    if (method === 'PATCH' && route === 'users/me') {
      const auth = requireAuth(request);
      if (auth instanceof NextResponse) return auth;

      const body = await readBody<UpdateUserPayload>(request);
      if (!body) return error('Corpo inválido', 400);

      if (body.name) auth.name = body.name;
      if (body.email) {
        const existing = findUserByEmail(body.email);
        if (existing && existing.id !== auth.id) {
          return error('Email já em uso', 409);
        }
        auth.email = body.email;
      }
      if (body.bio !== undefined) auth.bio = body.bio;

      return json(toPublicUser(auth));
    }

    if (method === 'GET' && route === 'users/me/events/confirmed') {
      const auth = requireAuth(request);
      if (auth instanceof NextResponse) return auth;

      const confirmed = store.confirmedByUser.get(auth.id) ?? new Set<number>();
      return json(store.events.filter((event) => confirmed.has(event.id)));
    }

    if (method === 'GET' && route === 'users/me/events/past') {
      const auth = requireAuth(request);
      if (auth instanceof NextResponse) return auth;

      const today = new Date().toISOString().slice(0, 10);
      const confirmed = store.confirmedByUser.get(auth.id) ?? new Set<number>();
      return json(
        store.events.filter(
          (event) => confirmed.has(event.id) && event.date < today,
        ),
      );
    }

    if (method === 'GET' && path[0] === 'users' && path[2] === 'events') {
      const organizerId = Number(path[1]);
      return json(store.events.filter((event) => event.organizerId === organizerId));
    }

    if (method === 'GET' && path[0] === 'users' && path.length === 2) {
      const userId = Number(path[1]);
      const user = findUserById(userId);
      if (!user) return error('Usuário não encontrado', 404);
      return json(toPublicUser(user));
    }

    if (method === 'GET' && route === 'admin/stats') {
      return json(SEED_PLATFORM_STATS);
    }

    if (method === 'GET' && route === 'admin/events/recent') {
      return json(store.events.slice(0, 5));
    }

    if (method === 'GET' && route === 'admin/organizers/pending') {
      return json(
        store.users
          .filter((user) => user.role === 'organizer' && user.pendingApproval)
          .map(toPublicUser),
      );
    }

    if (method === 'PATCH' && path[0] === 'admin' && path[1] === 'organizers' && path[3] === 'approve') {
      const userId = Number(path[2]);
      const user = findUserById(userId);
      if (!user) return error('Organizador não encontrado', 404);
      user.pendingApproval = false;
      return json(toPublicUser(user));
    }

    if (method === 'PATCH' && path[0] === 'admin' && path[1] === 'organizers' && path[3] === 'reject') {
      const userId = Number(path[2]);
      const index = store.users.findIndex((user) => user.id === userId);
      if (index === -1) return error('Organizador não encontrado', 404);
      store.users.splice(index, 1);
      return json({ success: true });
    }

    return error('Rota não encontrada', 404);
  } catch (err) {
    console.error('[api]', route, err);
    return error('Erro interno do servidor', 500);
  }
}
