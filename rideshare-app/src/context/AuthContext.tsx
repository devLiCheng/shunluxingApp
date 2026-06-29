import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { auth as authService } from '@/store/data';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => boolean;
  register: (name: string, phone: string, password: string) => boolean;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(authService.current());
  }, []);

  const login = (phone: string, password: string) => {
    const u = authService.login(phone, password);
    if (u) {
      setUser(u);
      return true;
    }
    return false;
  };

  const register = (name: string, phone: string, password: string) => {
    const u = authService.register(name, phone, password);
    if (u) {
      setUser(u);
      return true;
    }
    return false;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refresh = () => {
    setUser(authService.current());
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
