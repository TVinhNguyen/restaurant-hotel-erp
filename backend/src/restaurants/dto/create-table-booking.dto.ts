import { IsString, IsOptional, IsNumber, IsUUID, IsEnum, IsDateString, IsPositive } from 'class-validator';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SEATED = 'seated',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export class CreateTableBookingDto {
  @IsUUID()
  restaurantId: string;

  @IsOptional()
  @IsUUID()
  tableId?: string;

  @IsString()
  guestName: string;

  @IsString()
  guestPhone: string;

  @IsOptional()
  @IsString()
  guestEmail?: string;

  @IsDateString()
  bookingDate: string;

  @IsString()
  bookingTime: string;

  @IsNumber()
  @IsPositive()
  partySize: number;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

export class UpdateTableBookingDto {
  @IsOptional()
  @IsUUID()
  tableId?: string;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsString()
  guestPhone?: string;

  @IsOptional()
  @IsString()
  guestEmail?: string;

  @IsOptional()
  @IsDateString()
  bookingDate?: string;

  @IsOptional()
  @IsString()
  bookingTime?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  partySize?: number;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}