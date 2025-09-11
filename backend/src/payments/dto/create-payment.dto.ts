import { IsString, IsNumber, IsUUID, IsIn, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  reservationId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;

  @IsIn(['credit_card', 'debit_card', 'cash', 'bank_transfer', 'online'])
  paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'online';

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  gatewayResponse?: string;
}