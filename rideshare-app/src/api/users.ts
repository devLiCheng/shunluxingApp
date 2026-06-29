import { apiClient } from './client';
import type { User } from '@/types';

export const usersApi = {
  getProfile() {
    return apiClient.get<User>('/users/profile');
  },

  updateProfile(data: { name?: string; avatar?: string }) {
    return apiClient.patch<User>('/users/profile', data);
  },

  getUserById(id: string) {
    return apiClient.get<User>(`/users/${id}`);
  },
};
