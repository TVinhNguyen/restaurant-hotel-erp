import { IsOptional, IsDateString, IsString, IsNumber } from 'class-validator';

export class ReportQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  groupBy?: string;

  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsString()
  roomTypeId?: string;

  @IsOptional()
  @IsString()
  restaurantId?: string;
}

export class OccupancyReportDto {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  availableRooms: number;
  revenue: number;
}

export class RevenueReportDto {
  date: string;
  roomRevenue: number;
  serviceRevenue: number;
  totalRevenue: number;
  numberOfBookings: number;
  averageRevenuePerBooking: number;
}

export class RestaurantReportDto {
  date: string;
  totalBookings: number;
  totalRevenue: number;
  averagePartySize: number;
  popularTimeSlots: string[];
  occupancyRate: number;
}
