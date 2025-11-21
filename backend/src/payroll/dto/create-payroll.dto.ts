import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum PayrollStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export class CreatePayrollDto {
  @IsUUID()
  employeeId: string;

  @IsString()
  period: string; // Format: YYYY-MM

  @IsNumber()
  basicSalary: number;

  @IsNumber()
  netSalary: number;

  @IsOptional()
  @IsNumber()
  bonus?: number;

  @IsString()
  currency: string;
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
  netSalary?: number;

  @IsOptional()
  @IsNumber()
  bonus?: number;

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
    netSalary: number;
    bonus?: number;
    currency: string;
  }>;
}
