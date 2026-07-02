import { EMPTY_PROFILE, THEMES } from '../constants/defaultProfile';
import {
  clearSession,
  getSession,
  getUserByEmail,
  getUserByPhone,
  getUserById,
  getUsers,
  saveUsers,
  setSession,
  updateUser,
} from './storageService';

function generateId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function signup({ email, phone, password, fullName }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address.');
  }
  // Validate phone format if provided
  if (phone) {
    const phoneRegex = /^\+?[\d\s\-()]{10,20}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Please enter a valid phone number (10 to 20 digits).');
    }
    // Check if phone number already exists
    if (getUserByPhone(phone)) {
      throw new Error('An account with this phone number already exists.');
    }
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
  if (getUserByEmail(email)) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: generateId(),
    email: email.trim().toLowerCase(),
    password,
    theme: THEMES.CLASSIC,
    profile: {
      ...EMPTY_PROFILE,
      fullName: fullName?.trim() || '',
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
    },
    createdAt: new Date().toISOString(),
  };

  const users = getUsers();
  users.push(user);
  saveUsers(users);
  setSession(user.id);
  return sanitizeUser(user);
}

export function signin({ email: identifier, password }) {
  if (!identifier) {
    throw new Error('Email or phone number is required.');
  }
  if (!password) {
    throw new Error('Password is required.');
  }

  let user = null;
  const isEmail = identifier.includes('@');

  if (isEmail) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      throw new Error('Please enter a valid email address.');
    }
    user = getUserByEmail(identifier);
    if (!user) {
      throw new Error('No user found with this email.');
    }
  } else {
    // Validate phone format
    const phoneRegex = /^\+?[\d\s\-()]{10,20}$/;
    const cleanPhone = identifier.replace(/[^\d+]/g, '');
    if (!phoneRegex.test(identifier) || cleanPhone.length < 7) {
      throw new Error('Please enter a valid email address or phone number.');
    }
    user = getUserByPhone(identifier);
    if (!user) {
      throw new Error('No user found with this phone number.');
    }
  }

  if (user.password !== password) {
    throw new Error('Incorrect password.');
  }

  setSession(user.id);
  return sanitizeUser(user);
}

export function signout() {
  clearSession();
}

export function getCurrentUser() {
  const session = getSession();
  if (!session?.userId) return null;
  const user = getUserById(session.userId);
  return user ? sanitizeUser(user) : null;
}

export function saveProfile(userId, profile) {
  const updated = updateUser(userId, { profile });
  return updated ? sanitizeUser(updated) : null;
}

export function saveTheme(userId, theme) {
  const updated = updateUser(userId, { theme });
  return updated ? sanitizeUser(updated) : null;
}

function sanitizeUser(user) {
  const { password: _, ...safe } = user;
  return safe;
}
