import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  Min,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomTypeDto {
  @ApiProperty({ description: 'The ID of the property this room type belongs to' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'The name of the room type' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the room type', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Maximum number of adults', required: false, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAdults?: number;

  @ApiProperty({ description: 'Maximum number of children', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxChildren?: number;

  @ApiProperty({ description: 'Base price for the room type', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiProperty({ description: 'Type of bed in the room', required: false })
  @IsOptional()
  @IsString()
  bedType?: string;

  @ApiProperty({ description: 'List of amenity IDs associated with this room type', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  amenityIds?: string[];
}

export class AddAmenityToRoomTypeDto {
  @ApiProperty({ description: 'The ID of the amenity to add' })
  @IsUUID()
  amenityId: string;
}

export class BulkAddAmenitiesToRoomTypeDto {
  @ApiProperty({ description: 'List of amenity IDs to add', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  amenityIds: string[];
}

export class RoomTypeQueryDto {
  @ApiProperty({ description: 'Filter by property ID', required: false })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty({ description: 'Search term for room type name or description', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}
