import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('reservationId') reservationId?: string,
    @Query('status') status?: string,
    @Query('method') method?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.paymentsService.findAll({
      page: pageNum,
      limit: limitNum,
      reservationId,
      status,
      method,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.paymentsService.findOne(id);
  }

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentsService.create(createPaymentDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return await this.paymentsService.update(id, updatePaymentDto);
  }

  @Post(':id/process')
  @HttpCode(HttpStatus.OK)
  async processPayment(@Param('id') id: string) {
    return await this.paymentsService.processPayment(id);
  }

  @Post(':id/refund')
  @HttpCode(HttpStatus.OK)
  async refund(
    @Param('id') id: string,
    @Body() body: { amount?: number },
  ) {
    return await this.paymentsService.refund(id, body.amount);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.paymentsService.remove(id);
    return { message: 'Payment deleted successfully' };
  }
}