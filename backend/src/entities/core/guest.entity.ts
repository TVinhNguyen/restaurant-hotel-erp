import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from '../reservation/reservation.entity';
import { TableBooking } from '../restaurant/table-booking.entity';

@Entity({ schema: 'core', name: 'guests' })
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ name: 'loyalty_tier', length: 50, nullable: true })
  loyaltyTier: string;

  @Column({ name: 'passport_id', length: 50, nullable: true })
  passportId: string;

  @Column({ name: 'consent_marketing', default: false })
  consentMarketing: boolean;

  @Column({ name: 'privacy_version', length: 20, nullable: true })
  privacyVersion: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Reservation, (reservation) => reservation.guest)
  reservations: Reservation[];

  @OneToMany(() => TableBooking, (tableBooking) => tableBooking.guest)
  tableBookings: TableBooking[];
}
