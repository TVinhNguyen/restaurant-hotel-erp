import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(page?: string, limit?: string, reservationId?: string, status?: string, method?: string): Promise<{
        data: import("../entities").Payment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").Payment>;
    create(createPaymentDto: CreatePaymentDto): Promise<import("../entities").Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<import("../entities").Payment>;
    processPayment(id: string): Promise<import("../entities").Payment>;
    refund(id: string, body: {
        amount?: number;
    }): Promise<import("../entities").Payment>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
