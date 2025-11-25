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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'inventory', name: 'room_status_history' })
export class RoomStatusHistory {
  @ApiProperty({ description: 'Unique identifier for the history record' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the room' })
  @Column({ name: 'room_id', type: 'uuid' })
  roomId: string;

  @ApiProperty({
    description: 'Type of status change',
    enum: ['operational', 'housekeeping'],
  })
  @Column({ name: 'status_type', length: 20 })
  statusType: 'operational' | 'housekeeping';

  @ApiProperty({ description: 'New status value' })
  @Column({ length: 20 })
  status: string;

  @ApiProperty({ description: 'Date and time of the change' })
  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;

  @ApiProperty({
    description: 'ID of the user who made the change',
    required: false,
  })
  @Column({ name: 'changed_by', type: 'uuid', nullable: true })
  changedBy: string;

  @ApiProperty({ description: 'Notes regarding the change', required: false })
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
