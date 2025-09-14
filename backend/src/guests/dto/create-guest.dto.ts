import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  passportId?: string;

  @IsOptional()
  @IsBoolean()
  consentMarketing?: boolean;

  @IsOptional()
  @IsString()
  loyaltyTier?: string;

  @IsOptional()
  @IsString()
  privacyVersion?: string;
}