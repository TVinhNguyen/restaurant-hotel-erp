import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ description: 'ID of the property' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'ID of the room type' })
  @IsUUID()
  roomTypeId: string;

  @ApiProperty({ description: 'Room number' })
  @IsString()
  number: string;

  @ApiProperty({ description: 'Floor number' })
  @IsString()
  floor: string;

  @ApiProperty({ description: 'View type', required: false })
  @IsOptional()
  @IsString()
  viewType?: string;

  @ApiProperty({
    description: 'Operational status',
    enum: OperationalStatus,
    required: false,
    default: OperationalStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(OperationalStatus)
  operationalStatus?: OperationalStatus = OperationalStatus.AVAILABLE;

  @ApiProperty({
    description: 'Housekeeping status',
    enum: HousekeepingStatus,
    required: false,
    default: HousekeepingStatus.CLEAN,
  })
  @IsOptional()
  @IsEnum(HousekeepingStatus)
  housekeepingStatus?: HousekeepingStatus = HousekeepingStatus.CLEAN;

  @ApiProperty({ description: 'Notes from housekeeper', required: false })
  @IsOptional()
  @IsString()
  housekeeperNotes?: string;
}

export class UpdateRoomStatusDto {
  @ApiProperty({
    description: 'Operational status',
    enum: OperationalStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OperationalStatus)
  operationalStatus?: OperationalStatus;

  @ApiProperty({
    description: 'Housekeeping status',
    enum: HousekeepingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(HousekeepingStatus)
  housekeepingStatus?: HousekeepingStatus;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'ID of the user changing the status',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  changedBy?: string;
}

export class RoomQueryDto {
  @ApiProperty({ description: 'Filter by property ID', required: false })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty({ description: 'Filter by room type ID', required: false })
  @IsOptional()
  @IsUUID()
  roomTypeId?: string;

  @ApiProperty({ description: 'Filter by floor', required: false })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({
    description: 'Filter by operational status',
    enum: OperationalStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OperationalStatus)
  operationalStatus?: OperationalStatus;

  @ApiProperty({
    description: 'Filter by housekeeping status',
    enum: HousekeepingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(HousekeepingStatus)
  housekeepingStatus?: HousekeepingStatus;

  @ApiProperty({ description: 'Filter by view type', required: false })
  @IsOptional()
  @IsString()
  viewType?: string;

  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}

export class AvailableRoomsQueryDto {
  @ApiProperty({ description: 'Property ID' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'Room type ID', required: false })
  @IsOptional()
  @IsUUID()
  roomTypeId?: string;

  @ApiProperty({ description: 'Check-in date' })
  @IsDateString()
  checkIn: string;

  @ApiProperty({ description: 'Check-out date' })
  @IsDateString()
  checkOut: string;

  @ApiProperty({ description: 'Number of adults', required: false })
  @IsOptional()
  @IsNumber()
  adults?: number;

  @ApiProperty({ description: 'Number of children', required: false })
  @IsOptional()
  @IsNumber()
  children?: number;
}

export class BulkUpdateRoomsStatusDto {
  @ApiProperty({ description: 'List of room IDs', type: [String] })
  @IsUUID('4', { each: true })
  roomIds: string[];

  @ApiProperty({
    description: 'Operational status',
    enum: OperationalStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OperationalStatus)
  operationalStatus?: OperationalStatus;

  @ApiProperty({
    description: 'Housekeeping status',
    enum: HousekeepingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(HousekeepingStatus)
  housekeepingStatus?: HousekeepingStatus;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'ID of the user changing the status' })
  @IsUUID()
  changedBy: string;
}

export class ScheduleMaintenanceDto {
  @ApiProperty({ description: 'Type of maintenance' })
  @IsString()
  maintenanceType: string;

  @ApiProperty({ description: 'Scheduled date' })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ description: 'Estimated duration in hours' })
  @IsNumber()
  estimatedDurationHours: number;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Assigned staff ID', required: false })
  @IsOptional()
  @IsUUID()
  assignedStaffId?: string;
}

export class HousekeepingReportQueryDto {
  @ApiProperty({ description: 'Property ID' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'Filter by floor', required: false })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({ description: 'Date of report', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class OccupancyForecastQueryDto {
  @ApiProperty({ description: 'Property ID' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'Start date', required: false })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({ description: 'Room type ID', required: false })
  @IsOptional()
  @IsUUID()
  roomTypeId?: string;
}
