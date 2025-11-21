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

export enum EvaluationStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
  APPROVED = 'approved'
}

export enum RecommendedAction {
  PROMOTION = 'promotion',
  SALARY_INCREASE = 'salary_increase',
  TRAINING = 'training',
  MAINTAIN = 'maintain',
  IMPROVEMENT_PLAN = 'improvement_plan',
  WARNING = 'warning'
}

@Entity({ schema: 'hr', name: 'employee_evaluations' })
export class EmployeeEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'employee_name', length: 150, nullable: true })
  employeeName: string;

  @Column({ name: 'evaluator_id', type: 'uuid', nullable: true })
  evaluatorId: string;

  @Column({ name: 'evaluator_name', length: 150, nullable: true })
  evaluatorName: string;

  @Column({ name: 'evaluation_period', length: 50, nullable: true })
  evaluationPeriod: string;

  @Column({ name: 'evaluation_date', type: 'date', nullable: true })
  evaluationDate: Date;

  @Column({
    type: 'enum',
    enum: EvaluationStatus,
    default: EvaluationStatus.DRAFT
  })
  status: EvaluationStatus;

  // Performance Categories
  @Column({
    name: 'work_quality_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true
  })
  workQualityScore: number;

  @Column({ name: 'work_quality_comments', type: 'text', nullable: true })
  workQualityComments: string;

  @Column({
    name: 'productivity_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true
  })
  productivityScore: number;

  @Column({ name: 'productivity_comments', type: 'text', nullable: true })
  productivityComments: string;

  @Column({
    name: 'communication_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true
  })
  communicationScore: number;

  @Column({ name: 'communication_comments', type: 'text', nullable: true })
  communicationComments: string;

  @Column({
    name: 'teamwork_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true
  })
  teamworkScore: number;

  @Column({ name: 'teamwork_comments', type: 'text', nullable: true })
  teamworkComments: string;

  @Column({
    name: 'problem_solving_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true
  })
  problemSolvingScore: number;

  @Column({ name: 'problem_solving_comments', type: 'text', nullable: true })
  problemSolvingComments: string;

  @Column({
    name: 'punctuality_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true
  })
  punctualityScore: number;

  @Column({ name: 'punctuality_comments', type: 'text', nullable: true })
  punctualityComments: string;

  @Column({
    name: 'initiative_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true
  })
  initiativeScore: number;

  @Column({ name: 'initiative_comments', type: 'text', nullable: true })
  initiativeComments: string;

  // Overall Assessment
  @Column({
    name: 'overall_score',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true
  })
  overallScore: number;

  @Column({ name: 'overall_comments', type: 'text', nullable: true })
  overallComments: string;

  @Column({ type: 'text', array: true, nullable: true })
  strengths: string[];

  @Column({
    name: 'areas_for_improvement',
    type: 'text',
    array: true,
    nullable: true
  })
  areasForImprovement: string[];

  @Column({ type: 'text', array: true, nullable: true })
  goals: string[];

  // Manager's Decision
  @Column({ name: 'evaluated_by', type: 'uuid', nullable: true })
  evaluatedBy: string;

  @Column({
    name: 'recommended_action',
    type: 'enum',
    enum: RecommendedAction,
    nullable: true
  })
  recommendedAction: RecommendedAction;

  @Column({
    name: 'salary_recommendation',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true
  })
  salaryRecommendation: number;

  @Column({
    name: 'training_recommendations',
    type: 'text',
    array: true,
    nullable: true
  })
  trainingRecommendations: string[];

  // Employee Acknowledgment
  @Column({ name: 'employee_acknowledged', type: 'boolean', default: false })
  employeeAcknowledged: boolean;

  @Column({ name: 'employee_comments', type: 'text', nullable: true })
  employeeComments: string;

  @Column({ name: 'employee_acknowledged_date', type: 'date', nullable: true })
  employeeAcknowledgedDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Employee, employee => employee.evaluations)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'evaluator_id' })
  evaluator: Employee;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'evaluated_by' })
  evaluatedByEmployee: Employee;
}
