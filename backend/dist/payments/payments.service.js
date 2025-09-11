"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../entities/reservation/payment.entity");
let PaymentsService = class PaymentsService {
    paymentRepository;
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, reservationId, status, method } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.paymentRepository.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.reservation', 'reservation')
            .leftJoinAndSelect('reservation.guest', 'guest');
        if (reservationId) {
            queryBuilder.andWhere('payment.reservationId = :reservationId', { reservationId });
        }
        if (status) {
            queryBuilder.andWhere('payment.paymentStatus = :status', { status });
        }
        if (method) {
            queryBuilder.andWhere('payment.paymentMethod = :method', { method });
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
    async findOne(id) {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['reservation', 'reservation.guest'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }
    async create(createPaymentDto) {
        const payment = this.paymentRepository.create({
            ...createPaymentDto,
            paymentStatus: 'pending',
        });
        return await this.paymentRepository.save(payment);
    }
    async update(id, updatePaymentDto) {
        const payment = await this.findOne(id);
        Object.assign(payment, updatePaymentDto);
        return await this.paymentRepository.save(payment);
    }
    async processPayment(id) {
        const payment = await this.findOne(id);
        if (payment.paymentStatus !== 'pending') {
            throw new common_1.BadRequestException('Payment must be pending to process');
        }
        const isSuccess = Math.random() > 0.1;
        payment.paymentStatus = isSuccess ? 'completed' : 'failed';
        payment.transactionId = this.generateTransactionId();
        payment.gatewayResponse = isSuccess
            ? 'Payment processed successfully'
            : 'Payment failed - insufficient funds';
        return await this.paymentRepository.save(payment);
    }
    async refund(id, refundAmount) {
        const payment = await this.findOne(id);
        if (payment.paymentStatus !== 'completed') {
            throw new common_1.BadRequestException('Only completed payments can be refunded');
        }
        const amount = refundAmount || payment.amount;
        if (amount > payment.amount) {
            throw new common_1.BadRequestException('Refund amount cannot exceed original payment amount');
        }
        const refundPayment = this.paymentRepository.create({
            reservationId: payment.reservationId,
            amount: -amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            paymentStatus: 'refunded',
            transactionId: this.generateTransactionId(),
            gatewayResponse: `Refund for payment ${payment.id}`,
        });
        return await this.paymentRepository.save(refundPayment);
    }
    async remove(id) {
        const payment = await this.findOne(id);
        if (payment.paymentStatus === 'completed') {
            throw new common_1.BadRequestException('Cannot delete completed payment');
        }
        await this.paymentRepository.remove(payment);
    }
    generateTransactionId() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TXN${timestamp.slice(-8)}${random}`;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map