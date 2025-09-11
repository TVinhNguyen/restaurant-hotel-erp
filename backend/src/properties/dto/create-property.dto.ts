import { IsString, IsOptional, IsEmail, IsIn } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsIn(['Hotel', 'Resort', 'Restaurant Chain'])
  propertyType?: 'Hotel' | 'Resort' | 'Restaurant Chain';

  @IsOptional()
  @IsString()
  checkInTime?: string;

  @IsOptional()
  @IsString()
  checkOutTime?: string;
}