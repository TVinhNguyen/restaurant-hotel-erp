import { IsString, IsOptional, IsNumber, IsUUID, Min, IsArray } from 'class-validator';

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

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  amenityIds?: string[];
}

export class AddAmenityToRoomTypeDto {
  @IsUUID()
  amenityId: string;
}

export class BulkAddAmenitiesToRoomTypeDto {
  @IsArray()
  @IsUUID('4', { each: true })
  amenityIds: string[];
}

export class RoomTypeQueryDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}