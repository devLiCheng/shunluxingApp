import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  CreateDateColumn, UpdateDateColumn, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Booking } from '../bookings/booking.entity';

export enum TripStatus {
  OPEN = 'open',
  FULL = 'full',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  driverId: string;

  @ManyToOne(() => User, (user) => user.trips)
  @JoinColumn({ name: 'driverId' })
  driver: User;

  @Column({ length: 100 })
  from: string;

  @Column({ length: 100 })
  to: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ length: 5 })
  time: string;

  @Column()
  seats: number;

  @Column()
  availableSeats: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column({ nullable: true, length: 500 })
  note: string;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.OPEN })
  status: TripStatus;

  @OneToMany(() => Booking, (booking) => booking.trip)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
