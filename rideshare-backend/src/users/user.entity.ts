import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Trip } from '../trips/trip.entity';
import { Booking } from '../bookings/booking.entity';
import { Chat } from '../chats/chat.entity';
import { Message } from '../chats/message.entity';

export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, length: 255 })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PASSENGER,
  })
  role: UserRole;

  @Column({ default: false })
  isDriver: boolean;

  @Column({ default: false })
  driverVerified: boolean;

  @Column({ nullable: true, length: 20 })
  idCard: string;

  @Column({ nullable: true, length: 100 })
  carModel: string;

  @Column({ nullable: true, length: 20 })
  carPlate: string;

  @Column({ nullable: true, length: 20 })
  carColor: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 5.0 })
  rating: number;

  @Column({ default: 0 })
  tripCount: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Trip, (trip) => trip.driver)
  trips: Trip[];

  @OneToMany(() => Booking, (booking) => booking.passenger)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
