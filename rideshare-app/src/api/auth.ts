import { apiClient } from './client';
import type { User } from '@/types';

interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authApi = {
  async login(phone: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', { phone, password });
    apiClient.setToken(res.accessToken);
    return res;
  },

  async register(name: string, phone: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', { name, phone, password });
    apiClient.setToken(res.accessToken);
    return res;
  },

  async getMe(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  logout() {
    apiClient.setToken(null);
  },
};
