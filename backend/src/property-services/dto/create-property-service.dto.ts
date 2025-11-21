import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreatePropertyServiceDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  serviceId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @IsOptional()
  taxRate?: number;

  @IsString()
  @MaxLength(10)
  currency: string;
}
