import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description:
      'User password (min 6 chars, must contain uppercase, lowercase, and number)',
    example: 'Password123',
    minLength: 6,
    maxLength: 128,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
    pattern: '^[\\+]?[1-9][\\d]{0,15}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[+]?[1-9][\d]{0,15}$/, {
    message: 'Please provide a valid phone number',
  })
  phone?: string;
}
