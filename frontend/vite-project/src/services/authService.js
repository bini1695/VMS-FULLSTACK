import { api, setToken, clearToken } from './api.js';

export const authService = {
  async register({ name, email, password, phone, branch, role }) {
    const data = await api.post('/auth/register', {
      name,
      email,
      password,
      phone,
      branch,
      role,
    });
    setToken(data.token);
    return data.user;
  },

  async login({ email, password }) {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.token);
    return data.user;
  },

  async me() {
    const data = await api.get('/auth/me');
    return data.user;
  },

  logout() {
    clearToken();
  },
};