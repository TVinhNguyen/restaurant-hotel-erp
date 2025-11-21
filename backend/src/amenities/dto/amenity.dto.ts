import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AmenityCategory {
  ROOM = 'room',
  FACILITY = 'facility',
}

export class CreateAmenityDto {
  @ApiProperty({ description: 'The name of the amenity' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The category of the amenity', enum: AmenityCategory })
  @IsEnum(AmenityCategory)
  category: AmenityCategory;
}

export class UpdateAmenityDto {
  @ApiProperty({ description: 'The name of the amenity', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'The category of the amenity', enum: AmenityCategory, required: false })
  @IsOptional()
  @IsEnum(AmenityCategory)
  category?: AmenityCategory;
}

export class AmenityQueryDto {
  @ApiProperty({ description: 'Filter by category', enum: AmenityCategory, required: false })
  @IsOptional()
  @IsEnum(AmenityCategory)
  category?: AmenityCategory;

  @ApiProperty({ description: 'Search term for amenity name', required: false })
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
