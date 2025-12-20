import {
  IsString,
  IsOptional,
  IsUUID,
  IsIn,
  IsDateString,
  IsNumber,
  MaxLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'ID của người dùng liên kết',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'Mã nhân viên',
    example: 'EMP001',
    required: false,
  })
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @ApiProperty({
    description: 'Chức vụ của nhân viên',
    example: 'Manager',
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    description: 'Họ và tên nhân viên',
    example: 'Nguyen Van A',
  })
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Phòng ban của nhân viên',
    enum: ['Front Desk', 'Housekeeping', 'HR', 'F&B'],
    example: 'Front Desk',
    required: false,
  })
  @IsOptional()
  @IsIn(['Front Desk', 'Housekeeping', 'HR', 'F&B'])
  department?:
    | 'Front Desk'
    | 'Housekeeping'
    | 'HR'
    | 'F&B';

  @ApiProperty({
    description: 'Trạng thái của nhân viên',
    enum: ['active', 'on_leave', 'terminated'],
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'on_leave', 'terminated'])
  status?: 'active' | 'on_leave' | 'terminated';

  @ApiProperty({
    description: 'Ngày bắt đầu công tác (YYYY-MM-DD)',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @ApiProperty({
    description: 'Ngày kết thúc công tác (YYYY-MM-DD)',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  terminationDate?: string;

  @ApiProperty({
    description: 'Lương cơ bản của nhân viên',
    example: 15000000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiProperty({
    description: 'Địa chỉ của nhân viên',
    example: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({
    description: 'Giới tính',
    enum: ['male', 'female', 'other'],
    example: 'male',
    required: false,
  })
  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @ApiProperty({
    description: 'Ngày sinh (YYYY-MM-DD)',
    example: '1990-05-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Số chứng minh nhân dân/CCCD',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  idCardNumber?: string;
}
