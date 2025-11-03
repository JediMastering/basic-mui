/**
 * accountApi.js
 * Low-level API calls for accounts. Uses shared axios instance `api`.
 */
import api from '../../../service/api';

/**
 * GET /api/v1/accounts
 * Returns paginated list of accounts for a user
 */
export const getAccounts = async (userId, params = {}) => {
  const resp = await api.get('/api/v1/accounts', {
    params: { userId, ...params }
  });
  return resp.data;
};

/**
 * GET /api/v1/accounts/:id
 * Returns a single account by ID
 */
export const getAccountById = async (id, userId) => {
  const resp = await api.get(`/api/v1/accounts/${id}`, {
    params: { userId }
  });
  return resp.data;
};

/**
 * POST /api/v1/accounts
 * Creates a new account
 */
export const createAccount = async (userId, { name, type, initialBalance, description }) => {
  const resp = await api.post('/api/v1/accounts',
    { name, type, initialBalance, description },
    { params: { userId } }
  );
  return resp.data;
};

/**
 * PUT /api/v1/accounts/:id
 * Updates an existing account
 */
export const updateAccount = async (id, userId, { name, type, initialBalance, description }) => {
  const resp = await api.put(`/api/v1/accounts/${id}`,
    { name, type, initialBalance, description },
    { params: { userId } }
  );
  return resp.data;
};

/**
 * DELETE /api/v1/accounts/:id
 * Deletes an account
 */
export const deleteAccount = async (id, userId) => {
  await api.delete(`/api/v1/accounts/${id}`, {
    params: { userId }
  });
  return;
};

/**
 * PATCH /api/v1/accounts/:id/toggle-active
 * Toggles account active status
 */
export const toggleAccountActive = async (id, userId) => {
  const resp = await api.patch(`/api/v1/accounts/${id}/toggle-active`, null, {
    params: { userId }
  });
  return resp.data;
};
