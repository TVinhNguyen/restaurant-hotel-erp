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

  @Column({ name: 'net_salary', type: 'decimal', precision: 12, scale: 2 })
  netSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bonus: number;

  @Column({ length: 10 })
  currency: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Employee, (employee) => employee.payrolls)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
