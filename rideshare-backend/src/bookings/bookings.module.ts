import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './booking.entity';
import { Trip } from '../trips/trip.entity';
import { Chat } from '../chats/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Trip, Chat])],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
