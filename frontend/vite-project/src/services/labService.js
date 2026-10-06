import { api } from './api.js';
export const labService = {
  listRequisitions:  ()       => api.get('/lab/requisitions'),
  getRequisition:    (id)     => api.get(`/lab/requisitions/${id}`),
  createRequisition: (data)   => api.post('/lab/requisitions', data),
  updateRequisition: (id, d)  => api.put(`/lab/requisitions/${id}`, d),
  listFindings:      ()       => api.get('/lab/findings'),
  createFinding:     (data)   => api.post('/lab/findings', data),
};