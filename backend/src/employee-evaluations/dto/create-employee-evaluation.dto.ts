import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  IsBoolean,
  IsDateString,
  IsArray,
  Min,
  Max,
<<<<<<< HEAD
  ArrayMinSize
=======
>>>>>>> origin/dev
} from 'class-validator';
import { Type } from 'class-transformer';

<<<<<<< HEAD
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
=======
export enum EvaluationPeriod {
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
>>>>>>> origin/dev
}

export class CreateEmployeeEvaluationDto {
  @IsOptional()
  @IsUUID()
  employeeId: string;

  @IsOptional()
  @IsString()
  employeeName?: string;

  @IsOptional()
  @IsUUID()
  evaluatorId?: string;

  @IsOptional()
  @IsString()
  evaluatorName?: string;

  @IsOptional()
  @IsString()
  evaluationPeriod?: string;

  @IsOptional()
  @IsDateString()
  evaluationDate?: string;

  @IsOptional()
  @IsEnum(EvaluationStatus)
  status?: EvaluationStatus;

  // Performance Categories
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  workQualityScore?: number;

  @IsOptional()
  @IsString()
  workQualityComments?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  productivityScore?: number;

  @IsOptional()
  @IsString()
  productivityComments?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  communicationScore?: number;

  @IsOptional()
  @IsString()
  communicationComments?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  teamworkScore?: number;

  @IsOptional()
  @IsString()
  teamworkComments?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  problemSolvingScore?: number;

  @IsOptional()
  @IsString()
  problemSolvingComments?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  punctualityScore?: number;

  @IsOptional()
  @IsString()
  punctualityComments?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  initiativeScore?: number;

  @IsOptional()
  @IsString()
  initiativeComments?: string;

  // Overall Assessment
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  overallScore?: number;

  @IsOptional()
  @IsString()
  overallComments?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  strengths?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  areasForImprovement?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];

  // Manager's Decision
  @IsOptional()
  @IsUUID()
  evaluatedBy?: string;

  @IsOptional()
  @IsEnum(RecommendedAction)
  recommendedAction?: RecommendedAction;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryRecommendation?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trainingRecommendations?: string[];

  // Employee Acknowledgment
  @IsOptional()
  @IsBoolean()
  employeeAcknowledged?: boolean;

  @IsOptional()
  @IsString()
  employeeComments?: string;

  @IsOptional()
  @IsDateString()
  employeeAcknowledgedDate?: string;
}
