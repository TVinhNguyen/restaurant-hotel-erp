import { IsString, IsNumber, IsUUID, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateDailyRateDto {
  @IsUUID()
  ratePlanId: string;

  @IsString()
  date: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  availableRooms?: number;

  @IsOptional()
  @IsBoolean()
  stopSell?: boolean;
}
