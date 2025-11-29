import {
  IsString,
  IsOptional,
  IsUUID,
  IsIn,
  IsDateString,
  IsNumber
} from 'class-validator';

export class CreateEmployeeDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  employeeCode?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsIn(['Front Desk', 'Housekeeping', 'HR', 'F&B'])
  department?:
    | 'Front Desk'
    | 'Housekeeping'
    | 'HR'
    | 'F&B';

  @IsOptional()
  @IsIn(['active', 'on_leave', 'terminated'])
  status?: 'active' | 'on_leave' | 'terminated';

  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @IsOptional()
  @IsDateString()
  terminationDate?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;
}
