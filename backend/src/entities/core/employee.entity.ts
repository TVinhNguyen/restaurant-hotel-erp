import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../auth/user.entity';
import { EmployeeRole } from './employee-role.entity';
import { WorkingShift } from '../hr/working-shift.entity';
import { Attendance } from '../hr/attendance.entity';
import { Leave } from '../hr/leave.entity';
import { EmployeeEvaluation } from '../hr/employee-evaluation.entity';
import { Payroll } from '../hr/payroll.entity';
import { Overtime } from '../hr/overtime.entity';
import { Deduction } from '../hr/deduction.entity';

@Entity({ schema: 'core', name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'employee_code', length: 50, nullable: true })
  employeeCode: string;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ length: 50, nullable: true })
  department:
    | 'IT Department'
    | 'Human Resources'
    | 'Marketing'
    | 'Finances'
    | 'Sales';

  @Column({ length: 100, nullable: true })
  position: string;

  @Column({ length: 20, default: 'active' })
  status: 'active' | 'on_leave' | 'terminated';

  @Column({ name: 'hire_date', type: 'date', nullable: true })
  hireDate: Date;

  @Column({ name: 'termination_date', type: 'date', nullable: true })
  terminationDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  salary: number;

  // Relations
  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => EmployeeRole, employeeRole => employeeRole.employee)
  employeeRoles: EmployeeRole[];

  @OneToMany(() => WorkingShift, workingShift => workingShift.employee)
  workingShifts: WorkingShift[];

  @OneToMany(() => Attendance, attendance => attendance.employee)
  attendances: Attendance[];

  @OneToMany(() => Leave, leave => leave.employee)
  leaves: Leave[];

  @OneToMany(() => EmployeeEvaluation, evaluation => evaluation.employee)
  evaluations: EmployeeEvaluation[];

  @OneToMany(() => Payroll, payroll => payroll.employee)
  payrolls: Payroll[];

  @OneToMany(() => Overtime, overtime => overtime.employee)
  overtimes: Overtime[];

  @OneToMany(() => Deduction, deduction => deduction.employee)
  deductions: Deduction[];
}
