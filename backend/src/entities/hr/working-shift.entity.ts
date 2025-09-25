import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Property } from '../core/property.entity';
import { Employee } from '../core/employee.entity';
import { Attendance } from './attendance.entity';
import { Overtime } from './overtime.entity';

@Entity({ schema: 'hr', name: 'working_shifts' })
export class WorkingShift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid', nullable: true })
  propertyId: string;

  @Column({ name: 'employee_id', type: 'uuid', nullable: true })
  employeeId: string;

  @Column({ name: 'working_date', type: 'date', nullable: true })
  workingDate: Date;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string;

  @Column({ name: 'shift_type', length: 20, nullable: true })
  shiftType: 'morning' | 'night' | 'other';

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_reassigned', default: false, nullable: true })
  isReassigned: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Property, property => property.workingShifts)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => Employee, employee => employee.workingShifts)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany(() => Attendance, attendance => attendance.workingShift)
  attendances: Attendance[];

  @OneToMany(() => Overtime, overtime => overtime.workingShift)
  overtimes: Overtime[];
}
