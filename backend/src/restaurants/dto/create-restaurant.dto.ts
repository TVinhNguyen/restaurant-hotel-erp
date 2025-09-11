import { IsString, IsOptional, IsNumber, IsUUID, Matches } from 'class-validator';

export class CreateRestaurantDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cuisine?: string;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Open time must be in HH:MM format' })
  openTime?: string;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Close time must be in HH:MM format' })
  closeTime?: string;

  @IsOptional()
  @IsNumber()
  maxCapacity?: number;
}