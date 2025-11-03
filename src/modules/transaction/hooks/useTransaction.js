/**
 * useTransaction.js
 * Hook providing list/create/update/delete operations + local state for UI.
 */
import { useEffect, useState, useCallback } from 'react';
import * as api from '../api/transactionApi';

/**
 * Helper to get userId from localStorage token
 * Decodes JWT to extract userId
 */
const getUserIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    // JWT format: header.payload.signature
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.userId || decoded.sub || decoded.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const useTransaction = (userIdParam) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use provided userId or extract from token
  const userId = userIdParam || getUserIdFromToken();

  const load = useCallback(async (params = {}) => {
    if (!userId) {
      setError(new Error('userId not found'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.getTransactions(userId, params);
      setTransactions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      load();
    }
  }, [load, userId]);

  const create = async (payload) => {
    if (!userId) throw new Error('userId not found');

    const created = await api.createTransaction(userId, payload);
    // Reload to get updated data
    await load();
    return created;
  };

  const update = async (id, payload) => {
    if (!userId) throw new Error('userId not found');

    const updated = await api.updateTransaction(id, userId, payload);
    await load(); // Reload to ensure consistency
    return updated;
  };

  const remove = async (id) => {
    if (!userId) throw new Error('userId not found');

    await api.deleteTransaction(id, userId);
    // Remove from list
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  };

  const updateStatus = async (id, status) => {
    if (!userId) throw new Error('userId not found');

    const updated = await api.updateTransactionStatus(id, userId, status);
    setTransactions((prev) => prev.map((txn) => (txn.id === id ? updated : txn)));
    return updated;
  };

  return {
    transactions,
    loading,
    error,
    reload: load,
    create,
    update,
    remove,
    updateStatus,
  };
};
