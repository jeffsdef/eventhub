import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import type { Event, User } from '@/types';
import {
  DEMO_PASSWORD,
  SEED_EVENTS,
  SEED_USERS,
} from '@/server/seed-data';

export interface StoredUser extends User {
  passwordHash: string;
  pendingApproval?: boolean;
}

export interface AppStore {
  users: StoredUser[];
  events: Event[];
  confirmedByUser: Map<number, Set<number>>;
  nextUserId: number;
  nextEventId: number;
}

function hashPassword(password: string, salt?: string): string {
  const usedSalt = salt ?? randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(`${usedSalt}:${password}`).digest('hex');
  return `${usedSalt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const test = createHash('sha256').update(`${salt}:${password}`).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(test));
  } catch {
    return false;
  }
}

export function createPasswordHash(password: string): string {
  return hashPassword(password);
}

function createInitialStore(): AppStore {
  const demoHash = createPasswordHash(DEMO_PASSWORD);

  const users: StoredUser[] = SEED_USERS.map((user, index) => ({
    id: index + 1,
    ...user,
    passwordHash: demoHash,
    pendingApproval: user.role === 'organizer' && index === 2,
  }));

  return {
    users,
    events: SEED_EVENTS.map((event) => ({ ...event })),
    confirmedByUser: new Map([[1, new Set([2, 3])]]),
    nextUserId: users.length + 1,
    nextEventId: SEED_EVENTS.length + 1,
  };
}

const globalForStore = globalThis as typeof globalThis & {
  __eventhubStore?: AppStore;
};

export function getStore(): AppStore {
  if (!globalForStore.__eventhubStore) {
    globalForStore.__eventhubStore = createInitialStore();
  }
  return globalForStore.__eventhubStore;
}

export function toPublicUser(user: StoredUser): User {
  const { passwordHash: _passwordHash, pendingApproval: _pendingApproval, ...publicUser } = user;
  return publicUser;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getStore().users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

export function findUserById(id: number): StoredUser | undefined {
  return getStore().users.find((user) => user.id === id);
}
