import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  Min,
  Max
} from 'class-validator';

export enum EvaluationPeriod {
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual'
}

export class CreateEmployeeEvaluationDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsUUID()
  evaluatedBy?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  rate?: number;

  @IsOptional()
  @IsEnum(EvaluationPeriod)
  period?: EvaluationPeriod;

  @IsOptional()
  @IsString()
  goals?: string;

  @IsOptional()
  @IsString()
  strength?: string;

  @IsOptional()
  @IsString()
  improvement?: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
