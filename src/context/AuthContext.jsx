import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const resolve = useCallback(async (u) => {
    setUser(u);
    setIsAdmin(u ? await api.checkIsAdmin(u) : false);
    setLoading(false);
  }, []);

  useEffect(() => {
    api.getCurrentUser().then(resolve).catch(() => setLoading(false));
    return api.onAuthChange(resolve);
  }, [resolve]);

  const value = useMemo(() => ({
    user,
    isAdmin,
    loading,
    signIn: api.signIn,
    signOut: async () => {
      await api.signOut();
      setUser(null);
      setIsAdmin(false);
    },
    updatePassword: api.updateAdminPassword,
  }), [user, isAdmin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
