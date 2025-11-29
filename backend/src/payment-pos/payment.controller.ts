import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { CreatePaymentDto } from './types/dto';
import { PaymentWebhookGuard } from './guards/payment-webhook.guard';

@Controller('payments-pos')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() body: CreatePaymentDto): Promise<any> {
    return this.paymentService.createPayment(body);
  }

  @Post('webhook')
  @UseGuards(PaymentWebhookGuard)
  async handleWebhook(@Body() body: unknown) {
    console.log('Received webhook body:', body);
    return this.paymentService.handleWebhook(body);
  }

  // New endpoint to check payment status
  @Get('status/:orderId')
  async getPaymentStatus(@Param('orderId') orderId: string) {
    return this.paymentService.getPaymentStatus(orderId);
  }
}
