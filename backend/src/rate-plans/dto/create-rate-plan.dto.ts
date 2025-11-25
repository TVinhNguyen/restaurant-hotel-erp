import {
  IsString,
  IsNumber,
  IsUUID,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateRatePlanDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  roomTypeId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @IsString()
  currency: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minStay?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxStay?: number;

  @IsOptional()
  @IsBoolean()
  isRefundable?: boolean;
}
