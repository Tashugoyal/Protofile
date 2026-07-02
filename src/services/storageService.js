const USERS_KEY = 'job_apply_users';
const SESSION_KEY = 'job_apply_session';

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setSession(userId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getUserById(userId) {
  return getUsers().find((u) => u.id === userId) || null;
}

export function getUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserByPhone(phone) {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, '');
  return getUsers().find((u) => {
    const userPhone = u.profile?.phone || '';
    return userPhone.replace(/[^\d+]/g, '') === cleaned;
  }) || null;
}

export function updateUser(userId, updates) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
}
