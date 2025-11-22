import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Employee } from '../core/employee.entity';
import { User } from '../auth/user.entity';

@Entity({ schema: 'hr', name: 'leaves' })
export class Leave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'leave_date', type: 'date' })
  leaveDate: Date;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'number_of_days', type: 'int', default: 1 })
  numberOfDays: number;

  @Column({ name: 'leave_type', length: 20 })
  leaveType:
    | 'annual'
    | 'sick'
    | 'unpaid'
    | 'personal'
    | 'maternity'
    | 'emergency'
    | 'other';

  @Column({ length: 20, default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'text' })
  reason: string;

  @Column({ name: 'applied_date', type: 'date', nullable: true })
  appliedDate: Date;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_date', type: 'date', nullable: true })
  approvedDate: Date;

  @Column({ name: 'hr_note', type: 'text', nullable: true })
  hrNote: string;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Employee, employee => employee.leaves)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: User;
}
