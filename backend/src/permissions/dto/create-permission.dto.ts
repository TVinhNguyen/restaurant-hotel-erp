import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'reservation.view',
    description: 'Permission slug (unique identifier)',
  })
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiProperty({
    example: 'View Reservations',
    description: 'Permission name (short description)',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'FrontDesk',
    required: false,
    description: 'Module category',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  module?: string;

  @ApiProperty({
    example: 'Allows viewing all reservations in the system',
    required: false,
    description: 'Detailed description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
