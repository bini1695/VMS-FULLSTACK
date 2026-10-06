import { api } from './api.js';

export const ownerService = {
  list:   (query = '') => api.get(`/owners${query}`),
  get:    (id)         => api.get(`/owners/${id}`),
  create: (data)       => api.post('/owners', data),
  update: (id, data)   => api.put(`/owners/${id}`, data),
  remove: (id)         => api.delete(`/owners/${id}`),
};