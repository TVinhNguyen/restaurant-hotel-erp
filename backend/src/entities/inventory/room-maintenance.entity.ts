import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity({ schema: 'inventory', name: 'room_maintenance' })
export class RoomMaintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'room_id', type: 'uuid' })
  roomId: string;

  @Column({ name: 'issue_type', length: 50 })
  issueType: 'ac' | 'plumbing' | 'electrical' | 'furniture' | 'cleaning' | 'other';

  @Column({ length: 20 })
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @Column({ length: 20, default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'reported_by', length: 100 })
  reportedBy: string;

  @CreateDateColumn({ name: 'reported_at' })
  reportedAt: Date;

  @Column({ name: 'assigned_to', length: 100, nullable: true })
  assignedTo: string;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'estimated_hours', type: 'numeric', nullable: true })
  estimatedHours: number;

  @Column({ name: 'actual_hours', type: 'numeric', nullable: true })
  actualHours: number;

  @Column({ type: 'numeric', nullable: true })
  cost: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
