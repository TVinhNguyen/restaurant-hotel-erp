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

@Entity({ schema: 'hr', name: 'payrolls' })
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ length: 10 })
  period: string; // YYYY-MM

  @Column({ name: 'basic_salary', type: 'decimal', precision: 12, scale: 2 })
  basicSalary: number;

  @Column({
    name: 'overtime_pay',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0
  })
  overtimePay: number;

  @Column({
    name: 'allowances',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0
  })
  allowances: number;

  @Column({ name: 'gross_pay', type: 'decimal', precision: 12, scale: 2 })
  grossPay: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bonus: number;

  @Column({
    name: 'total_deductions',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0
  })
  totalDeductions: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column({
    name: 'social_insurance',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0
  })
  socialInsurance: number;

  @Column({
    name: 'health_insurance',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0
  })
  healthInsurance: number;

  @Column({ name: 'net_salary', type: 'decimal', precision: 12, scale: 2 })
  netSalary: number;

  @Column({ name: 'working_days', type: 'int', default: 0 })
  workingDays: number;

  @Column({ name: 'total_working_days', type: 'int', default: 22 })
  totalWorkingDays: number;

  @Column({
    type: 'enum',
    enum: ['draft', 'processed', 'paid'],
    default: 'draft'
  })
  status: 'draft' | 'processed' | 'paid';

  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate: Date;

  @Column({ length: 10, default: 'VND' })
  currency: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Employee, employee => employee.payrolls, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
