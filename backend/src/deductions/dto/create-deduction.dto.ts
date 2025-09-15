import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsString
} from 'class-validator';

export enum DeductionType {
  TAX = 'tax',
  INSURANCE = 'insurance',
  OTHER = 'other'
}

export class CreateDeductionDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsUUID()
  leaveId?: string;

  @IsOptional()
  @IsEnum(DeductionType)
  type?: DeductionType;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  reasonDetails?: string;
}
