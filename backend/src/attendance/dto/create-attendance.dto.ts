import {
  IsUUID,
  IsOptional,
  IsDateString,
  IsString,
  IsIn,
} from 'class-validator';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
}

export class CreateAttendanceDto {
  @IsUUID()
  employeeId: string;

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
  @IsUUID('4', { each: true })
  employeeIds: string[];

  @IsOptional()
  @IsUUID()
  workingShiftId?: string;

  @IsOptional()
  @IsIn(Object.values(AttendanceStatus))
  status?: AttendanceStatus;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  attendances?: Array<{
    employeeId: string;
    checkInTime?: string;
    checkOutTime?: string;
    notes?: string;
  }>;
}
