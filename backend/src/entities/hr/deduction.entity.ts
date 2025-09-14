import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from '../core/employee.entity';
import { Leave } from './leave.entity';

@Entity({ schema: 'hr', name: 'deductions' })
export class Deduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'leave_id', type: 'uuid', nullable: true })
  leaveId: string;

  @Column({ length: 20 })
  type: 'tax' | 'insurance' | 'other';

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'reason_details', type: 'text', nullable: true })
  reasonDetails: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Employee, (employee) => employee.deductions)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Leave, { nullable: true })
  @JoinColumn({ name: 'leave_id' })
  leave: Leave;
}
