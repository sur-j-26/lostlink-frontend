import api from './api';

const TOKEN_KEY = 'lostlink_auth_token';
const USER_KEY = 'lostlink_user';

export const authService = {
  // POST /api/auth/login
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const authData = response.data?.data;
    if (authData?.token) {
      localStorage.setItem(TOKEN_KEY, authData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    }
    return authData;
  },

  // POST /api/auth/register
  async register({ fullName, email, password, studentId, role }) {
    const response = await api.post('/auth/register', {
      fullName,
      email,
      password,
      studentId,
      role,
    });
    const authData = response.data?.data;
    if (authData?.token) {
      localStorage.setItem(TOKEN_KEY, authData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    }
    return authData;
  },

  // GET /api/auth/me
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      const user = response.data?.data;
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      return user;
    } catch {
      this.clearSession();
      return null;
    }
  },

  // POST /api/auth/logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      this.clearSession();
    }
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(this.getStoredToken());
  },
};

export default authService;
