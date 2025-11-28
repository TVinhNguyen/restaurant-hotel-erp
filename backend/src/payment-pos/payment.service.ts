import { Injectable, Inject } from '@nestjs/common';
import type { CreatePaymentDto } from './types/dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PayosRequestPaymentPayload } from './dto/payos-request-payment.payload';
import { createHmac } from 'node:crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PaymentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createPayment(body: CreatePaymentDto): Promise<any> {
    const url = `https://api-merchant.payos.vn/v2/payment-requests`;
    const config = {
      headers: {
        'x-client-id': this.configService.getOrThrow<string>('PAYOS_CLIENT_ID'),
        'x-api-key': this.configService.getOrThrow<string>('PAYOS_API_KEY'),
      },
    };
    const orderCode = body.orderId;
    const amount = body.amount;
    const description = body.description;

    // Simple approach - always use configured frontend URL
    const webUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const cancelUrl = `${webUrl}/payment/cancel?orderId=${orderCode}`;
    const returnUrl = `${webUrl}/payment/return?orderId=${orderCode}`;
    const signatureData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
    const signature = createHmac(
      'sha256',
      this.configService.getOrThrow<string>('PAYOS_CHECKSUM_KEY'),
    )
      .update(signatureData)
      .digest('hex');

    const payload: PayosRequestPaymentPayload = {
      orderCode,
      amount,
      description,
      cancelUrl,
      returnUrl,
      signature,
    };

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post<any>(url, payload, config),
      );
      console.log('PayOS response:', response.data);

      // ⚠️ QUAN TRỌNG: Dùng orderCode từ PayOS response, không phải từ body.orderId
      // PayOS có thể trả về orderCode khác (number) so với orderId gửi lên (string)
      const payosOrderCode = response.data?.data?.orderCode || orderCode;
      
      // Store initial payment status in Redis với orderCode từ PayOS
      const paymentKey = `payment:${payosOrderCode}`;
      console.log(`Storing payment in Redis with key: ${paymentKey}`);
      
      const paymentData = {
        orderId: payosOrderCode,
        originalOrderId: orderCode,
        status: 'pending',
        amount: amount,
        description: description,
        createdAt: new Date().toISOString(),
        payosData: response.data,
      };
      
      // TTL in milliseconds for cache-manager v5+
      await this.cacheManager.set(paymentKey, paymentData, 1800 * 1000);
      
      // Verify data was stored
      const verifyData = await this.cacheManager.get(paymentKey);
      console.log(`Redis stored verification: ${verifyData ? 'SUCCESS' : 'FAILED'}`);

      // Return response with orderId for frontend to track
      return {
        ...response.data,
        orderId: payosOrderCode,
      };
    } catch (error: any) {
      console.error('PayOS error:', error.response?.data || error.message);
      throw error;
    }
  }

  async handleWebhook(body: any) {
    console.log('Received webhook body:', body);

    try {
      // PayOS webhook structure: { code, data: { orderCode, ... } }
      // orderCode có thể nằm ở body.orderCode hoặc body.data.orderCode
      const orderCode = body.data?.orderCode || body.orderCode;
      const code = body.code;

      if (!orderCode) {
        console.warn('No orderCode in webhook body');
        return { received: true, error: 'Missing orderCode' };
      }

      const paymentKey = `payment:${orderCode}`;
      const existingPayment = await this.cacheManager.get(paymentKey);

      if (!existingPayment) {
        console.warn(`Payment not found for orderCode: ${orderCode}`);
        return { received: true, error: 'Payment not found' };
      }

      // Update payment status based on webhook
      let status = 'failed';
      if (code === '00' || code === 0) {
        status = 'success';
      } else if (code === 'CANCELLED') {
        status = 'cancelled';
      }

      const updatedPayment = {
        ...(existingPayment as any),
        status,
        webhookData: body,
        completedAt: new Date().toISOString(),
      };

      // Extend TTL for successful/completed payments to 1 hour (in milliseconds)
      const ttl = status === 'success' ? 3600 * 1000 : 1800 * 1000;
      await this.cacheManager.set(paymentKey, updatedPayment, ttl);

      console.log(`Payment status updated: ${orderCode} -> ${status}`);
      return { received: true, status };
    } catch (error) {
      console.error('Error processing webhook:', error);
      return { received: true, error: 'Processing failed' };
    }
  }

  // New method to check payment status
  async getPaymentStatus(orderId: string) {
    const paymentKey = `payment:${orderId}`;
    const payment = await this.cacheManager.get(paymentKey);

    if (!payment) {
      return { found: false, status: 'not_found' };
    }

    return { found: true, ...(payment as any) };
  }
}
