// ===================== Types =====================

export interface User {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  isDriver: boolean;
  driverVerified: boolean;
  rating: number;
  tripCount: number;
  idCard?: string;
  carModel?: string;
  carPlate?: string;
  carColor?: string;
  role?: string;
  createdAt?: string;
}

export interface BookingItem {
  id: string;
  tripId: string;
  passengerId: string;
  passenger: User;
  status: string;
  seats: number;
  createdAt: string;
}

export interface Trip {
  id: string;
  driverId: string;
  driver: User;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  availableSeats: number;
  price: number;
  note?: string;
  status: 'open' | 'full' | 'completed' | 'cancelled';
  bookings?: BookingItem[];
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: 'text';
  createdAt: string;
  isRead?: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  tripId?: string;
  lastMessage?: Message;
  updatedAt: string;
}

// Helper: get passenger IDs from a trip's bookings
export function getPassengerIds(trip: Trip): string[] {
  return trip.bookings?.map((b) => b.passengerId) || [];
}

// Helper: check if user is in chat
export function isUserInChat(chat: Chat, userId: string): boolean {
  return chat.participants?.some((p) => p.id === userId) ?? false;
}

// Helper: get other participant in a 1-on-1 chat
export function getOtherParticipant(chat: Chat, userId: string): User | undefined {
  return chat.participants?.find((p) => p.id !== userId);
}
