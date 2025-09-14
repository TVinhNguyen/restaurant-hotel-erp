import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { Employee } from '../core/employee.entity';

@Entity({ schema: 'inventory', name: 'room_status_history' })
export class RoomStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'room_id', type: 'uuid' })
  roomId: string;

  @Column({ name: 'status_type', length: 20 })
  statusType: 'operational' | 'housekeeping';

  @Column({ length: 20 })
  status: string;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;

  @Column({ name: 'changed_by', type: 'uuid', nullable: true })
  changedBy: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @ManyToOne(() => Room, (room) => room.statusHistory)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'changed_by' })
  changedByEmployee: Employee;
}
