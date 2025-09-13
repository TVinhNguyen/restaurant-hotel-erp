import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum AmenityCategory {
  ROOM = 'room',
  FACILITY = 'facility',
}

export class CreateAmenityDto {
  @IsString()
  name: string;

  @IsEnum(AmenityCategory)
  category: AmenityCategory;
}

export class UpdateAmenityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AmenityCategory)
  category?: AmenityCategory;
}

export class AmenityQueryDto {
  @IsOptional()
  @IsEnum(AmenityCategory)
  category?: AmenityCategory;

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