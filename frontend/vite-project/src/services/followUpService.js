import { api } from './api.js';

export const followUpService = {
  list:   (query = '') => api.get(`/follow-ups${query}`),
  get:    (id)         => api.get(`/follow-ups/${id}`),
  create: (data)       => api.post('/follow-ups', data),
  update: (id, data)   => api.put(`/follow-ups/${id}`, data),
  remove: (id)         => api.delete(`/follow-ups/${id}`),
};