import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Guest } from '../core/guest.entity';
import { Reservation } from '../reservation/reservation.entity';
import { RestaurantTable } from './restaurant-table.entity';

@Entity({ schema: 'restaurant', name: 'table_bookings' })
export class TableBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'restaurant_id', type: 'uuid' })
  restaurantId: string;

  @Column({ name: 'guest_id', type: 'uuid', nullable: true })
  guestId: string;

  @Column({ name: 'reservation_id', type: 'uuid', nullable: true })
  reservationId: string;

  @Column({ name: 'booking_date', type: 'date' })
  bookingDate: Date;

  @Column({ name: 'booking_time', type: 'time' })
  bookingTime: string;

  @Column({ type: 'int' })
  pax: number;

  @Column({ length: 30, default: 'pending' })
  status:
    | 'pending'
    | 'confirmed'
    | 'seated'
    | 'completed'
    | 'no_show'
    | 'cancelled';

  @Column({ name: 'assigned_table_id', type: 'uuid', nullable: true })
  assignedTableId: string;

  @Column({ name: 'special_requests', type: 'text', nullable: true })
  specialRequests: string;

  @Column({ name: 'duration_minutes', type: 'int', default: 90 })
  durationMinutes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne(() => Guest, (guest) => guest.tableBookings, { nullable: true })
  @JoinColumn({ name: 'guest_id' })
  guest: Guest;

  @ManyToOne(() => Reservation, { nullable: true })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @ManyToOne(() => RestaurantTable, (table) => table.bookings, {
    nullable: true,
  })
  @JoinColumn({ name: 'assigned_table_id' })
  assignedTable: RestaurantTable;
}
