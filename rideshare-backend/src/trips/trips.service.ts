import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Trip, TripStatus } from './trip.entity';
import { CreateTripDto, SearchTripDto } from './trip.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepo: Repository<Trip>,
  ) {}

  async create(driver: User, dto: CreateTripDto): Promise<Trip> {
    if (!driver.driverVerified) {
      throw new ForbiddenException('请先完成车主认证');
    }
    const trip = this.tripRepo.create({
      ...dto,
      driverId: driver.id,
      driver,
      availableSeats: dto.seats,
      status: TripStatus.OPEN,
    });
    return this.tripRepo.save(trip);
  }

  async search(query: SearchTripDto) {
    const { from, to, date, page = 1, limit = 20 } = query;
    const qb = this.tripRepo
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .where('trip.status = :status', { status: TripStatus.OPEN });

    if (from) qb.andWhere('trip.from LIKE :from', { from: `%${from}%` });
    if (to) qb.andWhere('trip.to LIKE :to', { to: `%${to}%` });
    if (date) qb.andWhere('trip.date = :date', { date });

    qb.orderBy('trip.date', 'ASC').addOrderBy('trip.time', 'ASC');
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findById(id: string): Promise<Trip> {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: ['driver', 'bookings', 'bookings.passenger'],
    });
    if (!trip) throw new NotFoundException('行程不存在');
    return trip;
  }

  async myTrips(userId: string) {
    return this.tripRepo.find({
      where: { driverId: userId },
      order: { createdAt: 'DESC' },
      relations: ['bookings', 'bookings.passenger'],
    });
  }

  async cancelTrip(id: string, userId: string) {
    const trip = await this.tripRepo.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('行程不存在');
    if (trip.driverId !== userId) throw new ForbiddenException('无权操作');
    await this.tripRepo.update(id, { status: TripStatus.CANCELLED });
    return { success: true };
  }

  async getAll(page = 1, limit = 20) {
    return this.tripRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['driver'],
    });
  }
}
