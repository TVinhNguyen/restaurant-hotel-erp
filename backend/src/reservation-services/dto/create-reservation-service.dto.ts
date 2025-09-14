import { IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';

export class CreateReservationServiceDto {
  @IsUUID()
  reservationId: string;

  @IsUUID()
  propertyServiceId: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsOptional()
  @IsString()
  dateProvided?: string;
}
