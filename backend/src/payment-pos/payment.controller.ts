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

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() body: CreatePaymentDto): Promise<any> {
    return this.paymentService.createPayment(body);
  }

  @Post('webhook')
  @UseGuards(PaymentWebhookGuard)
  handleWebhook() {
    return this.paymentService.handleWebhook();
  }
}
