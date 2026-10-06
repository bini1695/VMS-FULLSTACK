import { api } from './api.js';

export const paymentService = {
  list:   (query = '') => api.get(`/payments${query}`),
  create: (data)       => api.post('/payments', data),
  remove: (id)         => api.delete(`/payments/${id}`),
};