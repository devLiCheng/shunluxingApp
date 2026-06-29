// ===================== Mock Data Store =====================
import type { User, Trip, Chat, Message } from '@/types';

const STORAGE_KEYS = {
  currentUser: 'rs_current_user',
  users: 'rs_users',
  trips: 'rs_trips',
  chats: 'rs_chats',
  messages: 'rs_messages',
  bookings: 'rs_bookings',
};

function get<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function set<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---- Seed data ----
function seed() {
  if (get(STORAGE_KEYS.users).length > 0) return;

  const users: User[] = [
    {
      id: 'u1',
      name: '张明',
      phone: '13800138001',
      avatar: '',
      isDriver: true,
      driverVerified: true,
      rating: 4.9,
      tripCount: 126,
      joinDate: '2023-03',
      carModel: '特斯拉 Model 3',
      carPlate: '沪A88888',
      carColor: '白色',
      idCard: '110101199001011234',
    },
    {
      id: 'u2',
      name: '李梅',
      phone: '13900139002',
      avatar: '',
      isDriver: true,
      driverVerified: true,
      rating: 4.8,
      tripCount: 87,
      joinDate: '2023-06',
      carModel: '大众帕萨特',
      carPlate: '沪B12345',
      carColor: '黑色',
      idCard: '110101199205156789',
    },
    {
      id: 'u3',
      name: '王强',
      phone: '13700137003',
      avatar: '',
      isDriver: false,
      driverVerified: false,
      rating: 4.7,
      tripCount: 23,
      joinDate: '2024-01',
    },
  ];

  const trips: Trip[] = [
    {
      id: 't1',
      driverId: 'u1',
      driver: users[0],
      from: '上海虹桥站',
      to: '杭州西站',
      date: '2026-06-25',
      time: '08:30',
      seats: 3,
      availableSeats: 2,
      price: 80,
      note: '准时出发，不抽烟，行程约2小时',
      status: 'open',
      passengers: ['u3'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 't2',
      driverId: 'u2',
      driver: users[1],
      from: '上海南站',
      to: '苏州北站',
      date: '2026-06-25',
      time: '14:00',
      seats: 2,
      availableSeats: 2,
      price: 60,
      note: '高速直达，不绕路',
      status: 'open',
      passengers: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 't3',
      driverId: 'u1',
      driver: users[0],
      from: '南京南站',
      to: '上海虹桥',
      date: '2026-06-26',
      time: '10:00',
      seats: 3,
      availableSeats: 3,
      price: 120,
      status: 'open',
      passengers: [],
      createdAt: new Date().toISOString(),
    },
  ];

  const now = new Date().toISOString();
  const chatId = 'c1';
  const msgs: Message[] = [
    {
      id: 'm1',
      chatId,
      senderId: 'u3',
      content: '您好，我想搭您明天去杭州的车',
      type: 'text',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    {
      id: 'm2',
      chatId,
      senderId: 'u1',
      content: '没问题，8:30虹桥站出发，准时到！',
      type: 'text',
      createdAt: new Date(Date.now() - 3500000).toISOString(),
      read: true,
    },
  ];

  const chats: Chat[] = [
    {
      id: chatId,
      participants: ['u1', 'u3'],
      tripId: 't1',
      lastMessage: msgs[1],
      updatedAt: now,
    },
  ];

  set(STORAGE_KEYS.users, users);
  set(STORAGE_KEYS.trips, trips);
  set(STORAGE_KEYS.chats, chats);
  set(STORAGE_KEYS.messages, msgs);
  set(STORAGE_KEYS.bookings, []);
}

seed();

// ---- Auth ----
export const auth = {
  current(): User | null {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.currentUser);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  },
  login(phone: string, password: string): User | null {
    // demo: any 6+ char password works
    if (password.length < 6) return null;
    const users = get<User>(STORAGE_KEYS.users);
    let user = users.find((u) => u.phone === phone);
    if (!user) return null;
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
    return user;
  },
  register(name: string, phone: string, password: string): User | null {
    if (password.length < 6) return null;
    const users = get<User>(STORAGE_KEYS.users);
    if (users.find((u) => u.phone === phone)) return null;
    const user: User = {
      id: genId(),
      name,
      phone,
      isDriver: false,
      driverVerified: false,
      rating: 5.0,
      tripCount: 0,
      joinDate: new Date().toISOString().slice(0, 7),
    };
    set(STORAGE_KEYS.users, [...users, user]);
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
    return user;
  },
  logout() {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  },
  updateUser(updated: User) {
    const users = get<User>(STORAGE_KEYS.users);
    const idx = users.findIndex((u) => u.id === updated.id);
    if (idx >= 0) users[idx] = updated;
    set(STORAGE_KEYS.users, users);
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(updated));
  },
};

// ---- Trips ----
export const tripStore = {
  all(): Trip[] {
    return get<Trip>(STORAGE_KEYS.trips);
  },
  byId(id: string): Trip | undefined {
    return this.all().find((t) => t.id === id);
  },
  search(from: string, to: string, date: string): Trip[] {
    return this.all().filter(
      (t) =>
        t.status === 'open' &&
        (!from || t.from.includes(from)) &&
        (!to || t.to.includes(to)) &&
        (!date || t.date === date)
    );
  },
  myTrips(userId: string): Trip[] {
    return this.all().filter((t) => t.driverId === userId);
  },
  myBookings(userId: string): Trip[] {
    return this.all().filter((t) => t.passengers.includes(userId));
  },
  create(data: Omit<Trip, 'id' | 'createdAt' | 'passengers' | 'status'>): Trip {
    const trip: Trip = {
      ...data,
      id: genId(),
      passengers: [],
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const trips = this.all();
    set(STORAGE_KEYS.trips, [...trips, trip]);
    return trip;
  },
  book(tripId: string, userId: string): boolean {
    const trips = get<Trip>(STORAGE_KEYS.trips);
    const idx = trips.findIndex((t) => t.id === tripId);
    if (idx < 0) return false;
    const trip = trips[idx];
    if (trip.availableSeats <= 0 || trip.passengers.includes(userId)) return false;
    trip.passengers.push(userId);
    trip.availableSeats -= 1;
    if (trip.availableSeats === 0) trip.status = 'full';
    set(STORAGE_KEYS.trips, trips);
    return true;
  },
  cancel(tripId: string): void {
    const trips = get<Trip>(STORAGE_KEYS.trips);
    const idx = trips.findIndex((t) => t.id === tripId);
    if (idx >= 0) {
      trips[idx].status = 'cancelled';
      set(STORAGE_KEYS.trips, trips);
    }
  },
};

// ---- Chat ----
export const chatStore = {
  userChats(userId: string): Chat[] {
    return get<Chat>(STORAGE_KEYS.chats).filter((c) =>
      c.participants.includes(userId)
    );
  },
  getOrCreate(userA: string, userB: string, tripId?: string): Chat {
    const chats = get<Chat>(STORAGE_KEYS.chats);
    const existing = chats.find(
      (c) =>
        c.participants.includes(userA) &&
        c.participants.includes(userB) &&
        (tripId ? c.tripId === tripId : true)
    );
    if (existing) return existing;
    const chat: Chat = {
      id: genId(),
      participants: [userA, userB],
      tripId,
      updatedAt: new Date().toISOString(),
    };
    set(STORAGE_KEYS.chats, [...chats, chat]);
    return chat;
  },
  messages(chatId: string): Message[] {
    return get<Message>(STORAGE_KEYS.messages).filter((m) => m.chatId === chatId);
  },
  send(chatId: string, senderId: string, content: string): Message {
    const msg: Message = {
      id: genId(),
      chatId,
      senderId,
      content,
      type: 'text',
      createdAt: new Date().toISOString(),
      read: false,
    };
    const msgs = get<Message>(STORAGE_KEYS.messages);
    set(STORAGE_KEYS.messages, [...msgs, msg]);

    // update chat last message
    const chats = get<Chat>(STORAGE_KEYS.chats);
    const idx = chats.findIndex((c) => c.id === chatId);
    if (idx >= 0) {
      chats[idx].lastMessage = msg;
      chats[idx].updatedAt = msg.createdAt;
      set(STORAGE_KEYS.chats, chats);
    }
    return msg;
  },
  getUserById(id: string): User | undefined {
    return get<User>(STORAGE_KEYS.users).find((u) => u.id === id);
  },
};

// ---- Driver Verification ----
export const driverStore = {
  verify(userId: string, data: { idCard: string; carModel: string; carPlate: string; carColor: string }): User {
    const users = get<User>(STORAGE_KEYS.users);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      users[idx] = {
        ...users[idx],
        ...data,
        isDriver: true,
        driverVerified: true,
      };
      set(STORAGE_KEYS.users, users);
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(users[idx]));
      return users[idx];
    }
    throw new Error('User not found');
  },

  updateVehicle(userId: string, data: { carModel: string; carPlate: string; carColor: string }): User {
    const users = get<User>(STORAGE_KEYS.users);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...data };
      set(STORAGE_KEYS.users, users);
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(users[idx]));
      return users[idx];
    }
    throw new Error('User not found');
  },
};
