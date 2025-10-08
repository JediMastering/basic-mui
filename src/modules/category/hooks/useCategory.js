/**
 * useCategory.js
 * simple hook providing list/create/update/delete operations + local state for UI.
 * You can replace with React Query if project uses it.
 */
import { useEffect, useState, useCallback } from 'react';
import * as api from '../api/categoryApi';

export const useCategory = (includeInactiveDefault = false) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [includeInactive, setIncludeInactive] = useState(includeInactiveDefault);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCategories(includeInactive);
      setCategories(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (payload) => {
    const created = await api.createCategory(payload);
    // optimistic update: reload or push
    setCategories((prev) => [created, ...prev]);
    return created;
  };

  const update = async (id, payload) => {
    const updated = await api.updateCategory(id, payload);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const remove = async (id) => {
    await api.deleteCategory(id);
    // remove from list (since it's inactive by default)
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    categories,
    loading,
    error,
    includeInactive,
    setIncludeInactive,
    reload: load,
    create,
    update,
    remove,
  };
};
