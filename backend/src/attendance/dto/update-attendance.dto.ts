import {
  IsUUID,
  IsOptional,
  IsDateString,
  IsString,
  IsIn,
} from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsUUID()
  workingShiftId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  checkInTime?: string;

  @IsOptional()
  @IsDateString()
  checkOutTime?: string;

  @IsOptional()
  @IsIn(['present', 'absent', 'late', 'half-day'])
  status?: 'present' | 'absent' | 'late' | 'half-day';

  @IsOptional()
  @IsString()
  notes?: string;
}
