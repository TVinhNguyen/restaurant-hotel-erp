import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards
} from '@nestjs/common';
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
  handleWebhook(@Body() body: unknown) {
    console.log('Received webhook body:', body);
    return this.paymentService.handleWebhook(body);
  }
}
