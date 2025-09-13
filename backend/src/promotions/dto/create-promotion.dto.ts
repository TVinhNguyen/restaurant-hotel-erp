import { IsString, IsNumber, IsUUID, IsOptional, IsIn, Min } from 'class-validator';

export class CreatePromotionDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsIn(['percentage', 'fixed_amount'])
  discountType: 'percentage' | 'fixed_amount';

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsOptional()
  @IsString()
  validFrom?: string;

  @IsOptional()
  @IsString()
  validTo?: string;

  @IsOptional()
  @IsString()
  isActive?: boolean;
}
