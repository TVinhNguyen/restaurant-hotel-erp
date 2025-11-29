import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Property Manager', description: 'Role name' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'Manages property operations',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'per_property',
    enum: ['global', 'per_property'],
    description: 'Role scope',
  })
  @IsEnum(['global', 'per_property'])
  scope: 'global' | 'per_property';
}
