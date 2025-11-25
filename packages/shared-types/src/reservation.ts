/**
 * Reservation types
 */

import { UUID, TimestampFields } from './common';
import { Guest } from './guest';
import { Property } from './property';
import { RoomType, Room } from './room';

export interface Reservation extends TimestampFields {
  id: UUID;
  propertyId: UUID;
  guestId: UUID;
  roomTypeId: UUID;
  assignedRoomId?: UUID | null;
  ratePlanId?: UUID | null;
  confirmationCode: string;
  status: ReservationStatus;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children?: number;
  totalAmount: number;
  paidAmount?: number;
  balanceAmount?: number;
  specialRequests?: string;
  source?: ReservationSource;
  cancellationReason?: string;
  cancelledAt?: Date | null;
  
  // Relations (optional, loaded when needed)
  property?: Property;
  guest?: Guest;
  roomType?: RoomType;
  assignedRoom?: Room | null;
  payments?: Payment[];
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum ReservationSource {
  DIRECT = 'direct',
  ONLINE = 'online',
  BOOKING_COM = 'booking_com',
  EXPEDIA = 'expedia',
  AIRBNB = 'airbnb',
  PHONE = 'phone',
  WALK_IN = 'walk_in',
  TRAVEL_AGENT = 'travel_agent',
  OTHER = 'other',
}

export interface CreateReservationDto {
  propertyId: UUID;
  guestId: UUID;
  roomTypeId: UUID;
  ratePlanId?: UUID;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  specialRequests?: string;
  source?: ReservationSource;
}

export interface UpdateReservationDto extends Partial<CreateReservationDto> {
  id: UUID;
  status?: ReservationStatus;
  assignedRoomId?: UUID;
}

export interface CheckInDto {
  reservationId: UUID;
  assignedRoomId: UUID;
  actualCheckIn?: string;
  depositAmount?: number;
}

export interface CheckOutDto {
  reservationId: UUID;
  actualCheckOut?: string;
  finalAmount?: number;
  paymentMethod?: string;
}

export interface CancelReservationDto {
  reservationId: UUID;
  reason: string;
  refundAmount?: number;
}

export interface Payment extends TimestampFields {
  id: UUID;
  reservationId: UUID;
  guestId: UUID;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  notes?: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_PAYMENT = 'mobile_payment',
  CHECK = 'check',
  OTHER = 'other',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}
