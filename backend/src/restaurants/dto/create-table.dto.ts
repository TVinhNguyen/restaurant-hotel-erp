import { IsString, IsOptional, IsNumber, IsUUID, IsEnum, IsPositive } from 'class-validator';

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
}

export class CreateTableDto {
  @IsUUID()
  restaurantId: string;

  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsString()
  tableNumber: string;

  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;
}

export class UpdateTableDto {
  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsOptional()
  @IsString()
  tableNumber?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  capacity?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;
}