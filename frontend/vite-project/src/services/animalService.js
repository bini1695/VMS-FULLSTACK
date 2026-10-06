import { api } from './api.js';

export const animalService = {
  /** List all animals. Optional query string, e.g. '?q=Cooper' */
  list:   (query = '') => api.get(`/animals${query}`),

  /** Get a single animal by ID */
  get:    (id)         => api.get(`/animals/${id}`),

  /** Create a new animal */
  create: (data)       => api.post('/animals', data),

  /** Update an animal */
  update: (id, data)   => api.put(`/animals/${id}`, data),

  /** Delete an animal */
  remove: (id)         => api.delete(`/animals/${id}`),
};