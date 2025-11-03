/**
 * useAccount.js
 * Hook providing list/create/update/delete operations + local state for UI.
 */
import { useEffect, useState, useCallback } from 'react';
import * as api from '../api/accountApi';

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

export const useAccount = (userIdParam) => {
  const [accounts, setAccounts] = useState([]);
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
      const data = await api.getAccounts(userId, params);
      setAccounts(data);
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

    const created = await api.createAccount(userId, payload);
    // Optimistic update: reload or push to list
    await load(); // Reload to get updated balances
    return created;
  };

  const update = async (id, payload) => {
    if (!userId) throw new Error('userId not found');

    const updated = await api.updateAccount(id, userId, payload);
    await load(); // Reload to ensure consistency
    return updated;
  };

  const remove = async (id) => {
    if (!userId) throw new Error('userId not found');

    await api.deleteAccount(id, userId);
    // Remove from list
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const toggleActive = async (id) => {
    if (!userId) throw new Error('userId not found');

    const updated = await api.toggleAccountActive(id, userId);
    setAccounts((prev) => prev.map((acc) => (acc.id === id ? updated : acc)));
    return updated;
  };

  return {
    accounts,
    loading,
    error,
    reload: load,
    create,
    update,
    remove,
    toggleActive,
  };
};
