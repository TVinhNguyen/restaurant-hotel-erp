import { IsUUID, IsDateString, IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';

export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  UNPAID = 'unpaid',
  OTHER = 'other',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class CreateLeaveDto {
  @IsUUID()
  employeeId: string;

  @IsDateString()
  leaveDate: string;

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
  @IsUUID()
  approvedBy?: string;

  @IsOptional()
  @IsString()
  hrNote?: string;
}

export class UpdateLeaveDto {
  @IsOptional()
  @IsDateString()
  leaveDate?: string;

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
  @IsUUID()
  approvedBy?: string;

  @IsOptional()
  @IsString()
  hrNote?: string;
}

export class ApproveRejectLeaveDto {
  @IsEnum(LeaveStatus)
  status: LeaveStatus.APPROVED | LeaveStatus.REJECTED;

  @IsOptional()
  @IsString()
  hrNote?: string;
}