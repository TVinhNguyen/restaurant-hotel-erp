import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Property } from '../core/property.entity';
import { RoomType } from '../inventory/room-type.entity';
import { DailyRate } from './daily-rate.entity';
import { Reservation } from './reservation.entity';

@Entity({ schema: 'reservation', name: 'rate_plans' })
export class RatePlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ name: 'room_type_id', type: 'uuid' })
  roomTypeId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'cancellation_policy', type: 'text', nullable: true })
  cancellationPolicy: string;

  @Column({ length: 10 })
  currency: string;

  @Column({ name: 'min_stay', type: 'int', nullable: true })
  minStay: number;

  @Column({ name: 'max_stay', type: 'int', nullable: true })
  maxStay: number;

  @Column({ name: 'is_refundable', default: true })
  isRefundable: boolean;

  // Relations
  @ManyToOne(() => Property, (property) => property.ratePlans)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => RoomType, (roomType) => roomType.ratePlans)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomType;

  @OneToMany(() => DailyRate, (dailyRate) => dailyRate.ratePlan)
  dailyRates: DailyRate[];

  @OneToMany(() => Reservation, (reservation) => reservation.ratePlan)
  reservations: Reservation[];
}
