import { IsUUID, IsOptional, IsNumber } from 'class-validator';

export class CreateOvertimeDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsUUID()
  workingShiftId?: string;

  @IsOptional()
  @IsNumber()
  numberOfHours?: number;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsUUID()
  approvedBy?: string;
}
