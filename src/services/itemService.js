import api from './api';

/**
 * Real Database Integration for LostLink — Anurag University
 * Connects directly to Spring Boot backend API:
 *   GET  /api/items
 *   GET  /api/items/{id}
 *   POST /api/items
 */

// Fetch items directly from real backend database
export const getItems = async (params = {}) => {
  const response = await api.get('/items', { params });
  const raw = response.data;
  // Backend returns ApiResponse envelope { success: true, message: "...", data: [...] }
  const list = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
  return { data: list, isLive: true };
};

// Fetch item details by ID from database
export const getItemById = async (id) => {
  const response = await api.get(`/items/${id}`);
  const raw = response.data;
  const item = raw?.data || raw;
  return { data: item, isLive: true };
};

// Submit a new lost/found report to MySQL database
export const createItem = async (itemData) => {
  const response = await api.post('/items', itemData);
  const raw = response.data;
  const created = raw?.data || raw;
  return { data: created, isLive: true };
};

// Update an existing item report in MySQL database (requires owner/admin auth)
export const updateItem = async (id, itemData) => {
  const response = await api.put(`/items/${id}`, itemData);
  const raw = response.data;
  const updated = raw?.data || raw;
  return { data: updated, isLive: true };
};

// Delete an existing item report from MySQL database (requires owner/admin auth)
export const deleteItem = async (id) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};

