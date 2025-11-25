import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../core/employee.entity';
import { WorkingShift } from './working-shift.entity';

@Entity({ schema: 'hr', name: 'attendance' })
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'working_shift_id', type: 'uuid', nullable: true })
  workingShiftId: string;

  @Column({ name: 'date', type: 'date' })
  date: string;

  @Column({ name: 'check_in_time', type: 'timestamp', nullable: true })
  checkInTime: Date;

  @Column({ name: 'check_out_time', type: 'timestamp', nullable: true })
  checkOutTime: Date;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'present' })
  status: 'present' | 'absent' | 'late' | 'half-day';

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @ManyToOne(() => Employee, (employee) => employee.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => WorkingShift, (workingShift) => workingShift.attendances, {
    nullable: true,
  })
  @JoinColumn({ name: 'working_shift_id' })
  workingShift: WorkingShift;
}
