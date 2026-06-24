import { getApiBaseUrl } from './api-config';
import type {
  Category,
  Event,
  LoginPayload,
  PlatformStats,
  RegisterUserPayload,
  UpdateUserPayload,
  User,
} from '@/types';

const AUTH_TOKEN_KEY = 'eventhub_token';

function parseApiError(text: string, status: number): Error {
  try {
    const json = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(json.message)) {
      return new Error(json.message.join(', '));
    }
    if (typeof json.message === 'string') {
      return new Error(json.message);
    }
  } catch {
  }
  return new Error(text || `Erro na requisição: ${status}`);
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      cache: 'no-store',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente novamente.');
  }

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw parseApiError(text, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export function getEvents() {
  return apiFetch<Event[]>('/events');
}

export function getFeaturedEvents() {
  return apiFetch<Event[]>('/events/featured');
}

export function getEventById(id: number | string) {
  return apiFetch<Event>(`/events/${id}`);
}

export function getCategories() {
  return apiFetch<Category[]>('/categories');
}

export function registerUser(payload: RegisterUserPayload) {
  return apiFetch<User>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload) {
  const data = await apiFetch<{ accessToken: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setAuthToken(data.accessToken);
  return data.user;
}

export function getCurrentUser() {
  return apiFetch<User>('/users/me');
}

export function getUserById(id: number | string) {
  if (!id) return;
  return apiFetch<User>(`/users/${id}`);
}

export function updateCurrentUser(payload: UpdateUserPayload) {
  return apiFetch<User>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getUserConfirmedEvents() {
  return apiFetch<Event[]>('/users/me/events/confirmed');
}

export function getUserPastEvents() {
  return apiFetch<Event[]>('/users/me/events/past');
}

export function getOrganizerEvents(organizerId: number | string) {
  return apiFetch<Event[]>(`/users/${organizerId}/events`);
}

export function getPendingOrganizers() {
  return apiFetch<User[]>('/admin/organizers/pending');
}

export function approveOrganizer(id: number) {
  return apiFetch<User>(`/admin/organizers/${id}/approve`, { method: 'PATCH' });
}

export function rejectOrganizer(id: number) {
  return apiFetch<User>(`/admin/organizers/${id}/reject`, { method: 'PATCH' });
}

export function getPlatformStats() {
  return apiFetch<PlatformStats>('/admin/stats');
}

export function getRecentEvents() {
  return apiFetch<Event[]>('/admin/events/recent');
}

export function confirmEventPresence(eventId: number) {
  return apiFetch<void>(`/events/${eventId}/confirm`, { method: 'POST' });
}

export function deleteEvent(eventId: number) {
  return apiFetch<void>(`/events/${eventId}`, { method: 'DELETE' });
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  image?: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  price?: number;
  capacity?: number;
  featured?: boolean;
}

export function createEvent(payload: CreateEventPayload) {
  return apiFetch<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
