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
import { WorkingShift } from './working-shift.entity';

@Entity({ schema: 'hr', name: 'overtimes' })
export class Overtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'working_shift_id', type: 'uuid', nullable: true })
  workingShiftId: string;

  @Column({ name: 'number_of_hours', type: 'decimal', precision: 6, scale: 2 })
  numberOfHours: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  rate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Employee, (employee) => employee.overtimes)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => WorkingShift, { nullable: true })
  @JoinColumn({ name: 'working_shift_id' })
  workingShift: WorkingShift;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: Employee;
}
