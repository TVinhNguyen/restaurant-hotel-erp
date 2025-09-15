import { IsString, IsUUID, IsInt, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateTableBookingDto {
  @IsUUID()
  restaurantId: string;

  @IsOptional()
  @IsUUID()
  guestId?: string;

  @IsOptional()
  @IsUUID()
  reservationId?: string;

  @IsDateString()
  bookingDate: string;

  @IsString()
  bookingTime: string;

  @IsInt()
  pax: number;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsUUID()
  assignedTableId?: string;

  @IsOptional()
  @IsIn(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'])
  status?: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}

export class UpdateTableBookingDto {
  @IsOptional()
  @IsUUID()
  guestId?: string;

  @IsOptional()
  @IsDateString()
  bookingDate?: string;

  @IsOptional()
  @IsString()
  bookingTime?: string;

  @IsOptional()
  @IsInt()
  pax?: number;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsUUID()
  assignedTableId?: string;

  @IsOptional()
  @IsIn(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'])
  status?: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}
