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

  @Column({ name: 'booker_user_id', type: 'uuid', nullable: true })
  bookerUserId: string;

  @Column({ name: 'channel', length: 20, nullable: true })
  channel: 'ota' | 'website' | 'walkin' | 'phone';

  @Column({ name: 'external_ref', length: 100, nullable: true })
  externalRef: string;

  @Column({ name: 'promotion_id', type: 'uuid', nullable: true })
  promotionId: string;

  @Column({ name: 'check_in', type: 'date' })
  checkIn: Date;

  @Column({ name: 'check_out', type: 'date' })
  checkOut: Date;

  @Column({ type: 'int' })
  adults: number;

  @Column({ type: 'int', default: 0 })
  children: number;

  @Column({ name: 'contact_name', length: 100, nullable: true })
  contactName: string;

  @Column({ name: 'contact_email', length: 100, nullable: true })
  contactEmail: string;

  @Column({ name: 'contact_phone', length: 20, nullable: true })
  contactPhone: string;

  @Column({ name: 'guest_notes', type: 'text', nullable: true })
  guestNotes: string;

  @Column({ name: 'confirmation_code', length: 50, unique: true, nullable: true })
  confirmationCode: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'service_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  serviceAmount: number;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 12, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ length: 10 })
  currency: string;

  @Column({ name: 'payment_status', length: 20, default: 'unpaid' })
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';

  @Column({ length: 20, default: 'pending' })
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';

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
