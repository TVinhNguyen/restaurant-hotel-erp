import { Injectable } from '@nestjs/common';
import type { CreatePaymentDto } from './types/dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PayosRequestPaymentPayload } from './dto/payos-request-payment.payload';
import { generateSignature } from './payos-utils';

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
    const dataForSignature = {
      orderCode: Number(body.orderId),
      amount: body.amount,
      description: body.description,
      cancelUrl: 'https://example.com/cancel',
      returnUrl: 'https://example.com/return'
    };
    const signature = generateSignature(
      dataForSignature,
      this.configService.getOrThrow<string>('PAYOS_CHECKSUM_KEY')
    );
    const payload: PayosRequestPaymentPayload = {
      ...dataForSignature,
      signature
    };
    const response: AxiosResponse<any> = await firstValueFrom(
      this.httpService.post<any>(url, payload, config)
    );
    return response.data;
  }

  handleWebhook() {
    // TODO: Parse provider event and update payment
    return { received: true };
  }
}
