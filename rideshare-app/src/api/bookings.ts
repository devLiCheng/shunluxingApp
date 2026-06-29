import { apiClient } from './client';
import type { Trip } from '@/types';

export interface BookingRecord {
  id: string;
  tripId: string;
  passengerId: string;
  status: string;
  seats: number;
  createdAt: string;
  trip: Trip;
  passenger?: any;
}

export const bookingsApi = {
  book(tripId: string) {
    return apiClient.post<{ booking: BookingRecord; chatId: string }>(`/bookings/${tripId}`);
  },

  getMyBookings() {
    return apiClient.get<BookingRecord[]>('/bookings/my');
  },

  cancel(bookingId: string) {
    return apiClient.delete<{ success: boolean }>(`/bookings/${bookingId}`);
  },
};
