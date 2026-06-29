import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import { authApi } from '@/api/auth';
import { ApiError } from '@/api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('rs_token');
    if (token) {
      authApi.getMe()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem('rs_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    try {
      const res = await authApi.login(phone, password);
      setUser(res.user);
      return { success: true };
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : '登录失败，请重试';
      return { success: false, error: msg };
    }
  }, []);

  const register = useCallback(async (name: string, phone: string, password: string) => {
    try {
      const res = await authApi.register(name, phone, password);
      setUser(res.user);
      return { success: true };
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : '注册失败，请重试';
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const u = await authApi.getMe();
      setUser(u);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
