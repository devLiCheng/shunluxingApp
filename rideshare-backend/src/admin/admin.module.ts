import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { Trip } from '../trips/trip.entity';
import { Booking } from '../bookings/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Trip, Booking])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
