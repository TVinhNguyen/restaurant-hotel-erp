import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString
} from 'class-validator';

export enum PayrollStatus {
  DRAFT = 'draft',
  PROCESSED = 'processed',
  PAID = 'paid'
}

export class CreatePayrollDto {
  @IsUUID()
  employeeId: string;

  @IsString()
  period: string; // Format: YYYY-MM

  @IsNumber()
  basicSalary: number;

  @IsOptional()
  @IsNumber()
  overtimePay?: number;

  @IsOptional()
  @IsNumber()
  allowances?: number;

  @IsNumber()
  grossPay: number;

  @IsOptional()
  @IsNumber()
  bonus?: number;

  @IsOptional()
  @IsNumber()
  totalDeductions?: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsNumber()
  socialInsurance?: number;

  @IsOptional()
  @IsNumber()
  healthInsurance?: number;

  @IsNumber()
  netSalary: number;

  @IsOptional()
  @IsInt()
  workingDays?: number;

  @IsOptional()
  @IsInt()
  totalWorkingDays?: number;

  @IsOptional()
  @IsEnum(PayrollStatus)
  status?: PayrollStatus;

  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class UpdatePayrollDto {
  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsNumber()
  basicSalary?: number;

  @IsOptional()
  @IsNumber()
  overtimePay?: number;

  @IsOptional()
  @IsNumber()
  allowances?: number;

  @IsOptional()
  @IsNumber()
  grossPay?: number;

  @IsOptional()
  @IsNumber()
  bonus?: number;

  @IsOptional()
  @IsNumber()
  totalDeductions?: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsNumber()
  socialInsurance?: number;

  @IsOptional()
  @IsNumber()
  healthInsurance?: number;

  @IsOptional()
  @IsNumber()
  netSalary?: number;

  @IsOptional()
  @IsInt()
  workingDays?: number;

  @IsOptional()
  @IsInt()
  totalWorkingDays?: number;

  @IsOptional()
  @IsEnum(PayrollStatus)
  status?: PayrollStatus;

  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class BulkPayrollDto {
  @IsString()
  period: string; // YYYY-MM

  payrolls: Array<{
    employeeId: string;
    basicSalary: number;
    overtimePay?: number;
    allowances?: number;
    grossPay: number;
    bonus?: number;
    totalDeductions?: number;
    tax?: number;
    socialInsurance?: number;
    healthInsurance?: number;
    netSalary: number;
    workingDays?: number;
    totalWorkingDays?: number;
    status?: PayrollStatus;
    currency?: string;
  }>;
}
