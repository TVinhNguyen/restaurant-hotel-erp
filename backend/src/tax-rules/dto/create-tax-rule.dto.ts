import { IsString, IsNumber, IsUUID, IsIn, Min, Max, IsBoolean, IsOptional } from 'class-validator';

export class CreateTaxRuleDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  taxName: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate: number;

  @IsOptional()
  @IsBoolean()
  isInclusive?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
