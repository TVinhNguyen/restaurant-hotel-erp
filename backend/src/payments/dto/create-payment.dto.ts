import { IsString, IsNumber, IsUUID, IsIn, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  reservationId: string;

  @IsOptional()
  @IsUUID()
  parentPaymentId?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;

  @IsIn(['cash', 'card', 'bank', 'e_wallet', 'ota_virtual'])
  method: 'cash' | 'card' | 'bank' | 'e_wallet' | 'ota_virtual';

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsIn(['authorized', 'captured', 'refunded', 'voided'])
  status: 'authorized' | 'captured' | 'refunded' | 'voided';

  @IsOptional()
  @IsString()
  notes?: string;
}