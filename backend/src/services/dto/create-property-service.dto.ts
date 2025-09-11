import { IsString, IsNumber, IsUUID, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreatePropertyServiceDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  serviceId: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}