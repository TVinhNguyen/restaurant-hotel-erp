import { Repository } from 'typeorm';
import { Payment } from '../entities/reservation/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsService {
    private paymentRepository;
    constructor(paymentRepository: Repository<Payment>);
    findAll(query: {
        page?: number;
        limit?: number;
        reservationId?: string;
        status?: string;
        method?: string;
    }): Promise<{
        data: Payment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<Payment>;
    create(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment>;
    processPayment(id: string): Promise<Payment>;
    refund(id: string, refundAmount?: number): Promise<Payment>;
    remove(id: string): Promise<void>;
    private generateTransactionId;
}
