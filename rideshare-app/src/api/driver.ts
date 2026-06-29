import { apiClient } from './client';
import type { User } from '@/types';

export const driverApi = {
  verify(data: { idCard: string; carModel: string; carPlate: string; carColor: string }) {
    return apiClient.post<User>('/driver/verify', data);
  },

  updateVehicle(data: { carModel: string; carPlate: string; carColor: string }) {
    return apiClient.patch<User>('/driver/vehicle', data);
  },
};
