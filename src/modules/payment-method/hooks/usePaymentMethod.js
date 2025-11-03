/**
 * usePaymentMethod.js
 * Hook providing list/create/update/delete operations + local state for UI.
 */
import { useEffect, useState, useCallback } from 'react';
import * as api from '../api/paymentMethodApi';

export const usePaymentMethod = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPaymentMethods(params);
      setPaymentMethods(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (payload) => {
    const created = await api.createPaymentMethod(payload);
    // Optimistic update: reload or push to list
    setPaymentMethods((prev) => [created, ...prev]);
    return created;
  };

  const update = async (id, payload) => {
    const updated = await api.updatePaymentMethod(id, payload);
    setPaymentMethods((prev) => prev.map((pm) => (pm.id === id ? updated : pm)));
    return updated;
  };

  const remove = async (id) => {
    await api.deletePaymentMethod(id);
    // Remove from list
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
  };

  return {
    paymentMethods,
    loading,
    error,
    reload: load,
    create,
    update,
    remove,
  };
};
