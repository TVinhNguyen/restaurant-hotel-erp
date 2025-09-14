import { IsString, IsOptional, IsEmail, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({ obj }: any) => obj.property_type || obj.propertyType)
  propertyType?: 'Hotel' | 'Resort' | 'Restaurant Chain';

  @IsOptional()
  @IsString()
  @Transform(({ obj }: any) => obj.check_in_time || obj.checkInTime)
  checkInTime?: string;

  @IsOptional()
  @IsString()
  @Transform(({ obj }: any) => obj.check_out_time || obj.checkOutTime)
  checkOutTime?: string;
}