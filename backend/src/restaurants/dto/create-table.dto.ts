import { IsString, IsUUID, IsInt, IsOptional, IsIn } from 'class-validator';

export class CreateTableDto {
  @IsUUID()
  restaurantId: string;

  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsString()
  tableNumber: string;

  @IsInt()
  capacity: number;

  @IsOptional()
  @IsIn(['available', 'occupied', 'reserved'])
  status?: 'available' | 'occupied' | 'reserved';
}

export class UpdateTableDto {
  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsOptional()
  @IsString()
  tableNumber?: string;

  @IsOptional()
  @IsInt()
  capacity?: number;

  @IsOptional()
  @IsIn(['available', 'occupied', 'reserved'])
  status?: 'available' | 'occupied' | 'reserved';
}
