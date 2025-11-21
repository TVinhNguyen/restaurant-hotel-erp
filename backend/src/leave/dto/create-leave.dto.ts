import {
  IsUUID,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
<<<<<<< HEAD
  IsNumber
=======
  IsNumber,
>>>>>>> origin/dev
} from 'class-validator';

export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  UNPAID = 'unpaid',
  PERSONAL = 'personal',
  MATERNITY = 'maternity',
  EMERGENCY = 'emergency',
  OTHER = 'other'
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export class CreateLeaveDto {
  @IsUUID()
  employeeId: string;

  @IsDateString()
  leaveDate: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  numberOfDays?: number;

  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @IsOptional()
  @IsEnum(LeaveStatus)
  status?: LeaveStatus;

  @IsString()
  reason: string;

  @IsOptional()
  @IsDateString()
  appliedDate?: string;

  @IsOptional()
  @IsUUID()
  approvedBy?: string;

  @IsOptional()
  @IsDateString()
  approvedDate?: string;

  @IsOptional()
  @IsString()
  hrNote?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class UpdateLeaveDto {
  @IsOptional()
  @IsDateString()
  leaveDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  numberOfDays?: number;

  @IsOptional()
  @IsEnum(LeaveType)
  leaveType?: LeaveType;

  @IsOptional()
  @IsEnum(LeaveStatus)
  status?: LeaveStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  appliedDate?: string;

  @IsOptional()
  @IsUUID()
  approvedBy?: string;

  @IsOptional()
  @IsDateString()
  approvedDate?: string;

  @IsOptional()
  @IsString()
  hrNote?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class ApproveRejectLeaveDto {
  @IsEnum(LeaveStatus)
  status: LeaveStatus.APPROVED | LeaveStatus.REJECTED;

  @IsOptional()
  @IsString()
  hrNote?: string;
}
