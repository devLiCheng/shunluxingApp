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
  joinDate: string;
  idCard?: string;
  carModel?: string;
  carPlate?: string;
  carColor?: string;
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
  status: 'open' | 'full' | 'done' | 'cancelled';
  passengers: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text';
  createdAt: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  tripId?: string;
  lastMessage?: Message;
  updatedAt: string;
}

export interface BookingRequest {
  id: string;
  tripId: string;
  passengerId: string;
  passenger: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
