import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreatePromotionDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsString()
  @MaxLength(50)
  code: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  discountPercent: number;

  @IsOptional()
  @IsString()
  validFrom?: string;

  @IsOptional()
  @IsString()
  validTo?: string;
}
