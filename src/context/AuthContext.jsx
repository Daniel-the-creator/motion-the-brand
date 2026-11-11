import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';
import { isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const resolve = useCallback(async (u) => {
    setUser(u);
    setIsAdmin(u ? await api.checkIsAdmin(u) : false);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    api.getCurrentUser().then(resolve).catch(() => setLoading(false));
    return api.onAuthChange(resolve);
  }, [resolve]);

  const value = useMemo(() => ({
    user, isAdmin, loading,
    demoMode: !isSupabaseConfigured,
    signIn: api.signIn,
    signOut: async () => { await api.signOut(); setUser(null); setIsAdmin(false); },
  }), [user, isAdmin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

