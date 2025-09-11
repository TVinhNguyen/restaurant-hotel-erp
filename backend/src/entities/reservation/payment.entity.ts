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

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 10 })
  currency: string;

  @Column({ name: 'payment_method', length: 50 })
  paymentMethod:
    | 'credit_card'
    | 'debit_card'
    | 'cash'
    | 'bank_transfer'
    | 'online';

  @Column({ name: 'payment_status', length: 20 })
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';

  @Column({ name: 'transaction_id', length: 100, nullable: true })
  transactionId: string;

  @Column({ name: 'gateway_response', type: 'text', nullable: true })
  gatewayResponse: string;

  @CreateDateColumn({ name: 'paid_at' })
  paidAt: Date;

  // Relations
  @ManyToOne(() => Reservation, (reservation) => reservation.payments)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;
}
