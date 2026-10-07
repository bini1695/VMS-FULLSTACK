import { api } from './api.js';

export const messageService = {
  list:     (query = '')  => api.get(`/messages${query}`),
  get:      (id)          => api.get(`/messages/${id}`),
  create:   (data)        => api.post('/messages', data),
  markRead: (id)          => api.put(`/messages/${id}/read`),
  remove:   (id)          => api.delete(`/messages/${id}`),
};