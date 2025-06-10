
// In a real app, use a proper database and secure password hashing (e.g., bcrypt)
// For this demo, passwords are "hashed" by simply appending "-hashed" (NOT SECURE)
// and roles are basic.

import type { User } from './types';

declare global {
  // eslint-disable-next-line no-var
  var __users_store__: User[] | undefined;
}

// Simple "hashing" for demonstration. DO NOT USE IN PRODUCTION.
const pseudoHashPassword = (password: string): string => `${password}-hashed`;
const verifyPassword = (password: string, hash: string): boolean => pseudoHashPassword(password) === hash;

const initializeUsers = (): User[] => {
  return [
    {
      id: 'user-admin',
      username: 'admin',
      passwordHash: pseudoHashPassword('adminpassword'), // Store "hashed" password
      role: 'admin',
    },
    {
      id: 'user-test',
      username: 'testuser',
      passwordHash: pseudoHashPassword('testpassword'),
      role: 'user',
    }
  ];
};

if (process.env.NODE_ENV === 'production') {
  globalThis.__users_store__ = initializeUsers();
} else {
  if (!globalThis.__users_store__) {
    globalThis.__users_store__ = initializeUsers();
  }
}

const usersStore = globalThis.__users_store__!;

export const getUserByUsername = (username: string): User | undefined => {
  const user = usersStore.find(u => u.username.toLowerCase() === username.toLowerCase());
  return user ? { ...user } : undefined;
};

export const getUserById = (id: string): User | undefined => {
  const user = usersStore.find(u => u.id === id);
  return user ? { ...user } : undefined;
};

export const registerUser = (username: string, password: string): { success: boolean; user?: User; message?: string } => {
  if (getUserByUsername(username)) {
    return { success: false, message: 'Username already exists.' };
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    passwordHash: pseudoHashPassword(password),
    role: 'user', // New users are always 'user' role
  };
  usersStore.push(newUser);
  return { success: true, user: { ...newUser } };
};

export const attemptLogin = (username: string, password: string): User | null => {
  const user = getUserByUsername(username);
  if (user && verifyPassword(password, user.passwordHash)) {
    return { ...user }; // Return a copy
  }
  return null;
};
