import { IsString, IsOptional, IsNumber, IsUUID, IsEnum, IsDateString, IsBoolean } from 'class-validator';

export enum OperationalStatus {
  AVAILABLE = 'available',
  OUT_OF_SERVICE = 'out_of_service',
}

export enum HousekeepingStatus {
  CLEAN = 'clean',
  DIRTY = 'dirty',
  INSPECTED = 'inspected',
}

export class CreateRoomDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  roomTypeId: string;

  @IsString()
  number: string;

  @IsString()
  floor: string;

  @IsOptional()
  @IsString()
  viewType?: string;

  @IsOptional()
  @IsEnum(OperationalStatus)
  operationalStatus?: OperationalStatus = OperationalStatus.AVAILABLE;

  @IsOptional()
  @IsEnum(HousekeepingStatus)
  housekeepingStatus?: HousekeepingStatus = HousekeepingStatus.CLEAN;

  @IsOptional()
  @IsString()
  housekeeperNotes?: string;
}

export class UpdateRoomStatusDto {
  @IsOptional()
  @IsEnum(OperationalStatus)
  operationalStatus?: OperationalStatus;

  @IsOptional()
  @IsEnum(HousekeepingStatus)
  housekeepingStatus?: HousekeepingStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  changedBy?: string;
}

export class RoomQueryDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  roomTypeId?: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsEnum(OperationalStatus)
  operationalStatus?: OperationalStatus;

  @IsOptional()
  @IsEnum(HousekeepingStatus)
  housekeepingStatus?: HousekeepingStatus;

  @IsOptional()
  @IsString()
  viewType?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}

export class AvailableRoomsQueryDto {
  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsUUID()
  roomTypeId?: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsOptional()
  @IsNumber()
  adults?: number;

  @IsOptional()
  @IsNumber()
  children?: number;
}

export class BulkUpdateRoomsStatusDto {
  @IsUUID('4', { each: true })
  roomIds: string[];

  @IsOptional()
  @IsEnum(OperationalStatus)
  operationalStatus?: OperationalStatus;

  @IsOptional()
  @IsEnum(HousekeepingStatus)
  housekeepingStatus?: HousekeepingStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsUUID()
  changedBy: string;
}

export class ScheduleMaintenanceDto {
  @IsString()
  maintenanceType: string;

  @IsDateString()
  scheduledDate: string;

  @IsNumber()
  estimatedDurationHours: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  assignedStaffId?: string;
}

export class HousekeepingReportQueryDto {
  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class OccupancyForecastQueryDto {
  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsUUID()
  roomTypeId?: string;
}