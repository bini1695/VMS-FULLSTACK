import { api } from './api.js';

export const invoiceService = {
  list:   (query = '') => api.get(`/invoices${query}`),
  get:    (id)         => api.get(`/invoices/${id}`),
  create: (data)       => api.post('/invoices', data),
  update: (id, data)   => api.put(`/invoices/${id}`, data),
  remove: (id)         => api.delete(`/invoices/${id}`),
};