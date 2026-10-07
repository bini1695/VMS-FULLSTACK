import { api } from './api.js';

export const appointmentService = {
  list:   (query = '') => api.get(`/appointments${query}`),
  get:    (id)         => api.get(`/appointments/${id}`),
  create: (data)       => api.post('/appointments', data),
  update: (id, data)   => api.put(`/appointments/${id}`, data),
  remove: (id)         => api.delete(`/appointments/${id}`),
};