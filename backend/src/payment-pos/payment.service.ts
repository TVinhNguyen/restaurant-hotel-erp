import { Injectable } from '@nestjs/common';
import type { CreatePaymentDto } from './types/dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PayosRequestPaymentPayload } from './dto/payos-request-payment.payload';
import { createHmac } from 'node:crypto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async createPayment(body: CreatePaymentDto): Promise<any> {
    const url = `https://api-merchant.payos.vn/v2/payment-requests`;
    const config = {
      headers: {
        'x-client-id': this.configService.getOrThrow<string>('PAYOS_CLIENT_ID'),
        'x-api-key': this.configService.getOrThrow<string>('PAYOS_API_KEY')
      }
    };
    const orderCode = body.orderId;
    const amount = body.amount;
    const description = body.description;
    const cancelUrl = 'https://example.com/cancel';
    const returnUrl = 'https://example.com/return';
    const signatureData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
    const signature = createHmac(
      'sha256',
      this.configService.getOrThrow<string>('PAYOS_CHECKSUM_KEY')
    )
      .update(signatureData)
      .digest('hex');

    const payload: PayosRequestPaymentPayload = {
      orderCode,
      amount,
      description,
      cancelUrl,
      returnUrl,
      signature
    };

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post<any>(url, payload, config)
      );
      console.log('PayOS response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('PayOS error:', error.response?.data || error.message);
      throw error;
    }
  }

  handleWebhook(body: unknown) {
    // Handle the webhook logic here
    console.log('Received webhook body:', body);
    return { received: true };
  }
}
