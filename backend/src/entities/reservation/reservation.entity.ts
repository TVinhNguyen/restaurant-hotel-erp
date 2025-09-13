import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from '../core/property.entity';
import { Guest } from '../core/guest.entity';
import { RoomType } from '../inventory/room-type.entity';
import { Room } from '../inventory/room.entity';
import { RatePlan } from './rate-plan.entity';
import { Payment } from './payment.entity';
import { ReservationService } from './reservation-service.entity';

@Entity({ schema: 'reservation', name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ name: 'guest_id', type: 'uuid' })
  guestId: string;

  @Column({ name: 'room_type_id', type: 'uuid' })
  roomTypeId: string;

  @Column({ name: 'assigned_room_id', type: 'uuid', nullable: true })
  assignedRoomId: string;

  @Column({ name: 'rate_plan_id', type: 'uuid' })
  ratePlanId: string;

  @Column({ name: 'confirmation_number', length: 50, unique: true })
  confirmationNumber: string;

  @Column({ name: 'external_reference', length: 100, nullable: true })
  externalReference: string;

  @Column({ name: 'booking_channel', length: 50 })
  bookingChannel: 'OTA' | 'website' | 'walk-in' | 'phone';

  @Column({ name: 'check_in_date', type: 'date' })
  checkInDate: Date;

  @Column({ name: 'check_out_date', type: 'date' })
  checkOutDate: Date;

  @Column({ type: 'int' })
  adults: number;

  @Column({ type: 'int', default: 0 })
  children: number;

  @Column({ name: 'room_rate', type: 'decimal', precision: 12, scale: 2 })
  roomRate: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  taxAmount: number;

  @Column({
    name: 'service_charge',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  serviceCharge: number;

  @Column({ length: 10 })
  currency: string;

  @Column({ length: 20, default: 'confirmed' })
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';

  @Column({ name: 'special_requests', type: 'text', nullable: true })
  specialRequests: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Property, (property) => property.reservations)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => Guest, (guest) => guest.reservations)
  @JoinColumn({ name: 'guest_id' })
  guest: Guest;

  @ManyToOne(() => RoomType, (roomType) => roomType.reservations)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomType;

  @ManyToOne(() => Room, (room) => room.reservations, { nullable: true })
  @JoinColumn({ name: 'assigned_room_id' })
  assignedRoom: Room;

  @ManyToOne(() => RatePlan, (ratePlan) => ratePlan.reservations)
  @JoinColumn({ name: 'rate_plan_id' })
  ratePlan: RatePlan;

  @OneToMany(() => Payment, (payment) => payment.reservation)
  payments: Payment[];

  @OneToMany(() => ReservationService, (reservationService) => reservationService.reservation)
  reservationServices: ReservationService[];
}
