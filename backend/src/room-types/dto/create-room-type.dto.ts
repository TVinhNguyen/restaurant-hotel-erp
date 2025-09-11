import { IsString, IsOptional, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateRoomTypeDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAdults?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxChildren?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsString()
  bedType?: string;
}