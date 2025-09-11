import { IsDateString, IsOptional, IsUUID, IsEnum, IsString } from 'class-validator';

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export class ReportQueryDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod;
}

export class OccupancyReportDto extends ReportQueryDto {}

export class RevenueReportDto extends ReportQueryDto {
  @IsOptional()
  @IsUUID()
  roomTypeId?: string;
}

export class RestaurantReportDto extends ReportQueryDto {
  @IsOptional()
  @IsUUID()
  restaurantId?: string;
}