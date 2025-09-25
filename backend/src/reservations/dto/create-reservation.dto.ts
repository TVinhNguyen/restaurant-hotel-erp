import { IsString, IsNumber, IsUUID, IsDateString, IsIn, IsOptional, Min } from 'class-validator';

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
  bookerUserId?: string;

  @IsOptional()
  @IsUUID()
  assignedRoomId?: string;

  @IsOptional()
  @IsIn(['ota', 'website', 'walkin', 'phone'])
  channel?: 'ota' | 'website' | 'walkin' | 'phone';

  @IsOptional()
  @IsString()
  externalRef?: string;

  @IsOptional()
  @IsUUID()
  promotionId?: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsNumber()
  @Min(1)
  adults: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  children?: number;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  guestNotes?: string;

  @IsOptional()
  @IsString()
  confirmationCode?: string;

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
  discountAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  serviceAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsIn(['unpaid', 'partial', 'paid', 'refunded'])
  paymentStatus?: 'unpaid' | 'partial' | 'paid' | 'refunded';

  @IsOptional()
  @IsIn(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'])
  status?: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
}