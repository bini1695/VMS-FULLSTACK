import { api } from './api.js';
export const consultationService = {
  list:   ()           => api.get('/consultations'),
  get:    (id)         => api.get(`/consultations/${id}`),
  create: (data)       => api.post('/consultations', data),
  update: (id, data)   => api.put(`/consultations/${id}`, data),
};