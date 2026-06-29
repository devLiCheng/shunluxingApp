import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Trip } from '../trips/trip.entity';
import { Booking } from '../bookings/booking.entity';
import { Message } from '../chats/message.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
  ) {}

  async dashboard() {
    const [totalUsers, totalTrips, totalBookings, verifiedDrivers] = await Promise.all([
      this.userRepo.count(),
      this.tripRepo.count(),
      this.bookingRepo.count(),
      this.userRepo.count({ where: { driverVerified: true } }),
    ]);
    return { totalUsers, totalTrips, totalBookings, verifiedDrivers };
  }

  async users(page = 1, limit = 20) {
    const [items, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async trips(page = 1, limit = 20, status?: string) {
    const where: any = {};
    if (status) where.status = status;
    const [items, total] = await this.tripRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['driver'],
    });
    return { items, total, page, limit };
  }

  async drivers(page = 1, limit = 20) {
    const [items, total] = await this.userRepo.findAndCount({
      where: { isDriver: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async toggleUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return { success: false };
    await this.userRepo.update(id, { isActive: !user.isActive });
    return { success: true, isActive: !user.isActive };
  }

  async cancelTrip(id: string) {
    await this.tripRepo.update(id, { status: 'cancelled' as any });
    return { success: true };
  }
}
