import { api } from './api.js';
export const prescriptionService = {
  list:   ()           => api.get('/prescriptions'),
  create: (data)       => api.post('/prescriptions', data),
  update: (id, data)   => api.put(`/prescriptions/${id}`, data),
};