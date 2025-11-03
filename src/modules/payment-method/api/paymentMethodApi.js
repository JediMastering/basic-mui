/**
 * paymentMethodApi.js
 * Low-level API calls for payment methods. Uses shared axios instance `api`.
 */
import api from '../../../service/api';

/**
 * GET /api/v1/payment-methods
 * Returns paginated list of payment methods
 */
export const getPaymentMethods = async (params = {}) => {
  const resp = await api.get('/api/v1/payment-methods', { params });
  return resp.data;
};

/**
 * GET /api/v1/payment-methods/:id
 * Returns a single payment method by ID
 */
export const getPaymentMethodById = async (id) => {
  const resp = await api.get(`/api/v1/payment-methods/${id}`);
  return resp.data;
};

/**
 * POST /api/v1/payment-methods
 * Creates a new payment method
 */
export const createPaymentMethod = async ({ name, description, fgActive }) => {
  const resp = await api.post('/api/v1/payment-methods', { name, description, fgActive });
  return resp.data;
};

/**
 * PUT /api/v1/payment-methods/:id
 * Updates an existing payment method
 */
export const updatePaymentMethod = async (id, { name, description, fgActive }) => {
  const resp = await api.put(`/api/v1/payment-methods/${id}`, { name, description, fgActive });
  return resp.data;
};

/**
 * DELETE /api/v1/payment-methods/:id
 * Deletes a payment method
 */
export const deletePaymentMethod = async (id) => {
  await api.delete(`/api/v1/payment-methods/${id}`);
  return;
};
