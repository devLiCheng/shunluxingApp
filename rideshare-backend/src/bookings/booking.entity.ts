import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Trip } from '../trips/trip.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tripId: string;

  @Column()
  passengerId: string;

  @ManyToOne(() => Trip, (trip) => trip.bookings)
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'passengerId' })
  passenger: User;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @Column({ default: 1 })
  seats: number;

  @CreateDateColumn()
  createdAt: Date;
}
