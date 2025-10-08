/**
 * categoryApi.js
 * low-level API calls for categories. Uses shared axios instance `api`.
 */
import api from '../../../service/api';

/**
 * GET /api/categories?includeInactive=true|false
 * returns array of { id, name, fg }
 */
export const getCategories = async (includeInactive = false) => {
  const url = `/api/categories${includeInactive ? '?includeInactive=true' : ''}`;
  const resp = await api.get(url);
  return resp.data;
};

export const getCategoryById = async (id) => {
  const resp = await api.get(`/api/categories/${id}`);
  return resp.data;
};

export const createCategory = async ({ name }) => {
  const resp = await api.post('/api/categories', { name });
  return resp.data; // { id, name, fg }
};

export const updateCategory = async (id, { name }) => {
  const resp = await api.put(`/api/categories/${id}`, { name });
  return resp.data;
};

export const deleteCategory = async (id) => {
  // soft delete - backend marks fg = false
  await api.delete(`/api/categories/${id}`);
  return;
};
