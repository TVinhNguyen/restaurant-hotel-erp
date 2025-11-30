import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateEmployeeRoleDto {
  @ApiProperty({
    description: 'ID của nhân viên',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  employeeId: string;

  @ApiProperty({
    description: 'ID của cơ sở',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  propertyId: string;

  @ApiProperty({
    description: 'ID của vai trò',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  roleId: string;

  @ApiProperty({
    description: 'Ngày bắt đầu hiệu lực (YYYY-MM-DD)',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiProperty({
    description: 'Ngày kết thúc hiệu lực (YYYY-MM-DD)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}
