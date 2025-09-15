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

@Entity({ schema: 'hr', name: 'employee_evaluations' })
export class EmployeeEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid', nullable: true })
  employeeId: string;

  @Column({ name: 'evaluated_by', type: 'uuid', nullable: true })
  evaluatedBy: string;

  @Column({ type: 'int', nullable: true })
  rate: number;

  @Column({ length: 20, nullable: true })
  period: 'quarterly' | 'annual';

  @Column({ type: 'text', nullable: true })
  goals: string;

  @Column({ type: 'text', nullable: true })
  strength: string;

  @Column({ type: 'text', nullable: true })
  improvement: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Employee, employee => employee.evaluations)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'evaluated_by' })
  evaluator: Employee;
}
