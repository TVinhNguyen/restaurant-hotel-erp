import { IsString, IsOptional, IsNumber, IsUUID, IsDateString, IsIn, Min } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  guestId: string;

  @IsUUID()
  roomTypeId: string;

  @IsUUID()
  ratePlanId: string;

  @IsOptional()
  @IsUUID()
  assignedRoomId?: string;

  @IsOptional()
  @IsString()
  externalReference?: string;

  @IsIn(['OTA', 'website', 'walk-in', 'phone'])
  bookingChannel: 'OTA' | 'website' | 'walk-in' | 'phone';

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;

  @IsNumber()
  @Min(1)
  adults: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  children?: number;

  @IsNumber()
  @Min(0)
  roomRate: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  serviceCharge?: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}