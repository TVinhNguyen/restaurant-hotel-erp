import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateRestaurantDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  openingHours?: string;

  @IsOptional()
  @IsString()
  cuisineType?: string;
}
