import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [data, setData] = useState({ products: [], categories: [], collections: [], content: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setData(await api.fetchCatalog());
    } catch (e) {
      setError(e.message || 'Failed to load catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Wraps a mutation: run it, then reload the catalog.
  const mutate = useCallback(async (fn, ...args) => {
    const result = await fn(...args);
    await refresh();
    return result;
  }, [refresh]);

  const value = useMemo(() => ({
    ...data, loading, error, refresh,
    saveProduct: (p) => mutate(api.saveProduct, p),
    deleteProduct: (id) => mutate(api.deleteProduct, id),
    saveCategory: (c) => mutate(api.saveCategory, c),
    deleteCategory: (id) => mutate(api.deleteCategory, id),
    saveCollection: (c) => mutate(api.saveCollection, c),
    deleteCollection: (id) => mutate(api.deleteCollection, id),
    saveContent: (key, v) => mutate(api.saveContent, key, v),
  }), [data, loading, error, refresh, mutate]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}

