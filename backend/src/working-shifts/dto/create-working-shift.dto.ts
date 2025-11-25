import {
  IsUUID,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export enum ShiftType {
  MORNING = 'morning',
  NIGHT = 'night',
  OTHER = 'other',
}

export class CreateWorkingShiftDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsDateString()
  workingDate?: string;

  @IsOptional()
  @IsString()
  startTime?: string; // Format: HH:MM:SS

  @IsOptional()
  @IsString()
  endTime?: string; // Format: HH:MM:SS

  @IsOptional()
  @IsEnum(ShiftType)
  shiftType?: ShiftType;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isReassigned?: boolean;
}
