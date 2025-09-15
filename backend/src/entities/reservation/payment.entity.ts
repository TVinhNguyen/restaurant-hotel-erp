import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity({ schema: 'reservation', name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reservation_id', type: 'uuid' })
  reservationId: string;

  @Column({ name: 'parent_payment_id', type: 'uuid', nullable: true })
  parentPaymentId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 10 })
  currency: string;

  @Column({ name: 'method', length: 50 })
  method: 'cash' | 'card' | 'bank' | 'e_wallet' | 'ota_virtual';

  @Column({ name: 'transaction_id', length: 100, nullable: true })
  transactionId: string;

  @Column({ name: 'status', length: 20 })
  status: 'authorized' | 'captured' | 'refunded' | 'voided';

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'paid_at' })
  paidAt: Date;

  // Relations
  @ManyToOne(() => Reservation, (reservation) => reservation.payments)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;
}
