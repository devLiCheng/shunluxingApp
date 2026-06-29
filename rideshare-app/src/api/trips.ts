import { apiClient } from './client';
import type { Trip } from '@/types';

interface SearchResult {
  items: Trip[];
  total: number;
  page: number;
  limit: number;
}

export const tripsApi = {
  search(params: { from?: string; to?: string; date?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    if (params.date) query.set('date', params.date);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return apiClient.get<SearchResult>(`/trips/search?${query.toString()}`);
  },

  getById(id: string) {
    return apiClient.get<Trip>(`/trips/${id}`);
  },

  getMyTrips() {
    return apiClient.get<Trip[]>('/trips/my');
  },

  create(data: { from: string; to: string; date: string; time: string; seats: number; price: number; note?: string }) {
    return apiClient.post<Trip>('/trips', data);
  },

  cancel(id: string) {
    return apiClient.delete<{ success: boolean }>(`/trips/${id}`);
  },
};
