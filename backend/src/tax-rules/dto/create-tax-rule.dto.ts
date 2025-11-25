import { IsString, IsNumber, IsUUID, IsIn, Min, Max } from 'class-validator';

export class CreateTaxRuleDto {
  @IsUUID()
  propertyId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @IsString()
  @IsIn(['VAT', 'service'])
  type: 'VAT' | 'service';
}
