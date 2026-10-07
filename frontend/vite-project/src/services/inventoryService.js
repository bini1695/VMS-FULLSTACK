import { api } from './api.js';

export const inventoryService = {
  /** List all items from the inventory_items table */
  list: () => api.get('/inventory'),
};