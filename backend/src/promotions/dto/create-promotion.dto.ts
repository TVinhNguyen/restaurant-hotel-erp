import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
  Max,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePromotionDto {
  @ApiPropertyOptional({
    description:
      'Property ID - if empty, applies to all properties (global promotion)',
    example: 'f091036b-abd9-4005-9abc-831d2eb46ee6',
  })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiProperty({
    description: 'Unique promotion code',
    example: 'SUMMER2025',
    maxLength: 50,
  })
  @IsString({ message: 'Code must be a string' })
  @MaxLength(50, { message: 'Code must not exceed 50 characters' })
  @Transform(({ value }: { value: string }) => value?.toUpperCase() || value)
  code: string;

  @ApiProperty({
    description: 'Discount percentage (0-100)',
    example: 15.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Discount must be a number with max 2 decimal places' },
  )
  @Min(0, { message: 'Discount must be at least 0' })
  @Max(100, { message: 'Discount cannot exceed 100' })
  discountPercent: number;

  @ApiPropertyOptional({
    description: 'Valid from date (YYYY-MM-DD format)',
    example: '2025-06-01',
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'Valid from must be a valid date (YYYY-MM-DD)' },
  )
  validFrom?: string;

  @ApiPropertyOptional({
    description: 'Valid to date (YYYY-MM-DD format)',
    example: '2025-08-31',
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'Valid to must be a valid date (YYYY-MM-DD)' },
  )
  validTo?: string;

  @ApiPropertyOptional({
    description: 'Promotion description',
    example: 'Summer special discount for new guests',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Additional notes for internal use',
    example: 'Only for direct bookings',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes must not exceed 500 characters' })
  notes?: string;
}
