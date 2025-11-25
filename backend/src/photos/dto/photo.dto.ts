import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhotoDto {
  @ApiProperty({ description: 'The room type ID this photo belongs to' })
  @IsUUID()
  roomTypeId: string;

  @ApiProperty({ description: 'The URL of the photo' })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'The caption/description of the photo',
    required: false,
  })
  @IsOptional()
  @IsString()
  caption?: string;
}

export class UpdatePhotoDto {
  @ApiProperty({
    description: 'The room type ID this photo belongs to',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  roomTypeId?: string;

  @ApiProperty({ description: 'The URL of the photo', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    description: 'The caption/description of the photo',
    required: false,
  })
  @IsOptional()
  @IsString()
  caption?: string;
}

export class PhotoQueryDto {
  @ApiProperty({ description: 'Filter by room type ID', required: false })
  @IsOptional()
  @IsUUID()
  roomTypeId?: string;

  @ApiProperty({ description: 'Search term for caption', required: false })
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
