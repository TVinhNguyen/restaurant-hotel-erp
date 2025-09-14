import { IsString, IsOptional, IsUUID, IsInt } from 'class-validator';

export class CreateRestaurantDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cuisine?: string;

  @IsOptional()
  @IsString()
  openTime?: string;

  @IsOptional()
  @IsString()
  closeTime?: string;

  @IsOptional()
  @IsInt()
  maxCapacity?: number;
}
