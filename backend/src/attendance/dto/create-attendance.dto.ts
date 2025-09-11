import { IsUUID, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
  OVERTIME = 'overtime',
}

export class CreateAttendanceDto {
  @IsUUID()
  employeeId: string;

  @IsOptional()
  @IsUUID()
  workingShiftId?: string;

  @IsOptional()
  @IsDateString()
  checkInTime?: string; // Will be converted to timestamp

  @IsOptional()
  @IsDateString()
  checkOutTime?: string; // Will be converted to timestamp

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAttendanceDto {
  @IsOptional()
  @IsUUID()
  workingShiftId?: string;

  @IsOptional()
  @IsDateString()
  checkInTime?: string;

  @IsOptional()
  @IsDateString()
  checkOutTime?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkAttendanceDto {
  @IsDateString()
  date: string;

  attendances: Array<{
    employeeId: string;
    status: AttendanceStatus;
    checkInTime?: string;
    checkOutTime?: string;
    notes?: string;
  }>;
}