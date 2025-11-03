/**
 * transactionApi.js
 * Low-level API calls for transactions. Uses shared axios instance `api`.
 */
import api from '../../../service/api';

/**
 * GET /api/v1/transactions
 * Returns paginated list of transactions for a user
 */
export const getTransactions = async (userId, params = {}) => {
  const resp = await api.get('/api/v1/transactions', {
    params: { userId, ...params }
  });
  return resp.data;
};

/**
 * GET /api/v1/transactions/:id
 * Returns a single transaction by ID
 */
export const getTransactionById = async (id, userId) => {
  const resp = await api.get(`/api/v1/transactions/${id}`, {
    params: { userId }
  });
  return resp.data;
};

/**
 * POST /api/v1/transactions
 * Creates a new transaction
 */
export const createTransaction = async (userId, data) => {
  const resp = await api.post('/api/v1/transactions',
    data,
    { params: { userId } }
  );
  return resp.data;
};

/**
 * PUT /api/v1/transactions/:id
 * Updates an existing transaction
 */
export const updateTransaction = async (id, userId, data) => {
  const resp = await api.put(`/api/v1/transactions/${id}`,
    data,
    { params: { userId } }
  );
  return resp.data;
};

/**
 * DELETE /api/v1/transactions/:id
 * Deletes a transaction
 */
export const deleteTransaction = async (id, userId) => {
  await api.delete(`/api/v1/transactions/${id}`, {
    params: { userId }
  });
  return;
};

/**
 * PATCH /api/v1/transactions/:id/status
 * Updates transaction status
 */
export const updateTransactionStatus = async (id, userId, status) => {
  const resp = await api.patch(`/api/v1/transactions/${id}/status`, null, {
    params: { userId, status }
  });
  return resp.data;
};

/**
 * GET /api/v1/transactions/type/:type
 * Returns transactions filtered by type (RECEITA or DESPESA)
 */
export const getTransactionsByType = async (type, userId, params = {}) => {
  const resp = await api.get(`/api/v1/transactions/type/${type}`, {
    params: { userId, ...params }
  });
  return resp.data;
};

/**
 * GET /api/v1/transactions/status/:status
 * Returns transactions filtered by status
 */
export const getTransactionsByStatus = async (status, userId, params = {}) => {
  const resp = await api.get(`/api/v1/transactions/status/${status}`, {
    params: { userId, ...params }
  });
  return resp.data;
};

/**
 * GET /api/v1/transactions/period
 * Returns transactions within a date range
 */
export const getTransactionsByPeriod = async (userId, startDate, endDate, params = {}) => {
  const resp = await api.get('/api/v1/transactions/period', {
    params: { userId, startDate, endDate, ...params }
  });
  return resp.data;
};
