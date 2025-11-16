import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/reservation/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    reservationId?: string;
    status?: string;
    method?: string;
  }) {
    const { page = 1, limit = 10, reservationId, status, method } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.reservation', 'reservation')
      .leftJoinAndSelect('reservation.guest', 'guest');

    if (reservationId) {
      queryBuilder.andWhere('payment.reservationId = :reservationId', {
        reservationId,
      });
    }

    if (status) {
      queryBuilder.andWhere('payment.status = :status', { status });
    }

    if (method) {
      queryBuilder.andWhere('payment.method = :method', { method });
    }

    const [data, total] = await queryBuilder
      .orderBy('payment.paidAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['reservation', 'reservation.guest'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      // status field is required in DTO, no need to set default
    });

    return await this.paymentRepository.save(payment);
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);

    Object.assign(payment, updatePaymentDto);

    return await this.paymentRepository.save(payment);
  }

  async processPayment(id: string): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== 'authorized') {
      throw new BadRequestException('Payment must be authorized to process');
    }

    // Simulate payment processing
    const isSuccess = Math.random() > 0.1; // 90% success rate

    payment.status = isSuccess ? 'captured' : 'voided';
    payment.transactionId = this.generateTransactionId();
    payment.notes = isSuccess
      ? 'Payment processed successfully'
      : 'Payment failed - insufficient funds';

    return await this.paymentRepository.save(payment);
  }

  async refund(id: string, refundAmount?: number): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== 'captured') {
      throw new BadRequestException('Only captured payments can be refunded');
    }

    const amount = refundAmount || payment.amount;

    if (amount > payment.amount) {
      throw new BadRequestException(
        'Refund amount cannot exceed original payment amount',
      );
    }

    // Create refund payment record
    const refundPayment = this.paymentRepository.create({
      reservationId: payment.reservationId,
      parentPaymentId: payment.id,
      amount: -amount, // Negative amount for refund
      currency: payment.currency,
      method: payment.method,
      status: 'refunded',
      transactionId: this.generateTransactionId(),
      notes: `Refund for payment ${payment.id}`,
    });

    return await this.paymentRepository.save(refundPayment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);

    if (payment.status === 'captured') {
      throw new BadRequestException('Cannot delete captured payment');
    }

    await this.paymentRepository.remove(payment);
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN${timestamp.slice(-8)}${random}`;
  }
}
