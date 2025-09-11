import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RatePlan } from './rate-plan.entity';

@Entity({ schema: 'reservation', name: 'daily_rates' })
@Index(['ratePlanId', 'date'], { unique: true })
export class DailyRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rate_plan_id', type: 'uuid' })
  ratePlanId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ name: 'available_rooms', type: 'int', nullable: true })
  availableRooms: number;

  @Column({ name: 'stop_sell', default: false })
  stopSell: boolean;

  // Relations
  @ManyToOne(() => RatePlan, (ratePlan) => ratePlan.dailyRates)
  @JoinColumn({ name: 'rate_plan_id' })
  ratePlan: RatePlan;
}
