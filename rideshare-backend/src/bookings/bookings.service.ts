import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { Trip, TripStatus } from '../trips/trip.entity';
import { User } from '../users/user.entity';
import { Chat } from '../chats/chat.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    private dataSource: DataSource,
  ) {}

  async book(user: User, tripId: string) {
    const trip = await this.tripRepo.findOne({
      where: { id: tripId },
      relations: ['driver'],
    });
    if (!trip) throw new NotFoundException('行程不存在');
    if (trip.status !== TripStatus.OPEN) throw new BadRequestException('行程已满员或已结束');
    if (trip.driverId === user.id) throw new BadRequestException('不能预订自己的行程');

    const existing = await this.bookingRepo.findOne({
      where: { tripId, passengerId: user.id, status: BookingStatus.CONFIRMED },
    });
    if (existing) throw new ConflictException('您已预订该行程');

    // Transaction: create booking + update seats + create/get chat
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const booking = this.bookingRepo.create({ tripId, passengerId: user.id });
      await queryRunner.manager.save(booking);

      trip.availableSeats -= 1;
      if (trip.availableSeats === 0) trip.status = TripStatus.FULL;
      await queryRunner.manager.save(trip);

      // Auto-create chat between passenger and driver
      let chat = await this.chatRepo
        .createQueryBuilder('chat')
        .innerJoin('chat.participants', 'p')
        .where('p.id IN (:...ids)', { ids: [user.id, trip.driverId] })
        .andWhere('chat.tripId = :tripId', { tripId })
        .getOne();

      if (!chat) {
        const driver = await queryRunner.manager.findOne(User, { where: { id: trip.driverId } });
        chat = this.chatRepo.create({ tripId, participants: [user, driver!] });
        await queryRunner.manager.save(chat);
      }

      await queryRunner.commitTransaction();
      return { booking, chatId: chat.id };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async myBookings(userId: string) {
    return this.bookingRepo.find({
      where: { passengerId: userId },
      relations: ['trip', 'trip.driver'],
      order: { createdAt: 'DESC' },
    });
  }

  async cancel(userId: string, bookingId: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId, passengerId: userId },
      relations: ['trip'],
    });
    if (!booking) throw new NotFoundException('预订不存在');
    if (booking.status === BookingStatus.CANCELLED) throw new BadRequestException('已取消');

    booking.status = BookingStatus.CANCELLED;
    booking.trip.availableSeats += 1;
    if (booking.trip.status === TripStatus.FULL) booking.trip.status = TripStatus.OPEN;

    await this.bookingRepo.save(booking);
    await this.tripRepo.save(booking.trip);
    return { success: true };
  }
}
