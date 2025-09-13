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
exports.ReservationServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_service_entity_1 = require("../entities/reservation/reservation-service.entity");
let ReservationServicesService = class ReservationServicesService {
    reservationServiceRepository;
    constructor(reservationServiceRepository) {
        this.reservationServiceRepository = reservationServiceRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, reservationId, propertyServiceId } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.reservationServiceRepository.createQueryBuilder('reservationService')
            .leftJoinAndSelect('reservationService.reservation', 'reservation')
            .leftJoinAndSelect('reservationService.propertyService', 'propertyService')
            .leftJoinAndSelect('propertyService.service', 'service');
        if (reservationId) {
            queryBuilder.andWhere('reservationService.reservationId = :reservationId', { reservationId });
        }
        if (propertyServiceId) {
            queryBuilder.andWhere('reservationService.propertyServiceId = :propertyServiceId', { propertyServiceId });
        }
        const [data, total] = await queryBuilder
            .orderBy('reservationService.dateProvided', 'DESC')
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
        const reservationService = await this.reservationServiceRepository.findOne({
            where: { id },
            relations: ['reservation', 'propertyService', 'propertyService.service'],
        });
        if (!reservationService) {
            throw new common_1.NotFoundException(`Reservation service with ID ${id} not found`);
        }
        return reservationService;
    }
    async create(createReservationServiceDto) {
        const entityData = {
            reservationId: createReservationServiceDto.reservationId,
            propertyServiceId: createReservationServiceDto.propertyServiceId,
            quantity: createReservationServiceDto.quantity,
            totalPrice: createReservationServiceDto.totalPrice,
            dateProvided: createReservationServiceDto.dateProvided ?
                new Date(createReservationServiceDto.dateProvided) : undefined,
        };
        const reservationService = this.reservationServiceRepository.create(entityData);
        return await this.reservationServiceRepository.save(reservationService);
    }
    async update(id, updateReservationServiceDto) {
        const reservationService = await this.findOne(id);
        if (updateReservationServiceDto.reservationId !== undefined) {
            reservationService.reservationId = updateReservationServiceDto.reservationId;
        }
        if (updateReservationServiceDto.propertyServiceId !== undefined) {
            reservationService.propertyServiceId = updateReservationServiceDto.propertyServiceId;
        }
        if (updateReservationServiceDto.quantity !== undefined) {
            reservationService.quantity = updateReservationServiceDto.quantity;
        }
        if (updateReservationServiceDto.totalPrice !== undefined) {
            reservationService.totalPrice = updateReservationServiceDto.totalPrice;
        }
        if (updateReservationServiceDto.dateProvided !== undefined) {
            reservationService.dateProvided = new Date(updateReservationServiceDto.dateProvided);
        }
        return await this.reservationServiceRepository.save(reservationService);
    }
    async remove(id) {
        const reservationService = await this.findOne(id);
        await this.reservationServiceRepository.remove(reservationService);
    }
    async findByReservation(reservationId) {
        return await this.reservationServiceRepository.find({
            where: { reservationId },
            relations: ['propertyService', 'propertyService.service'],
            order: { dateProvided: 'DESC' },
        });
    }
    async getTotalServiceAmount(reservationId) {
        const result = await this.reservationServiceRepository
            .createQueryBuilder('reservationService')
            .select('SUM(reservationService.totalPrice)', 'total')
            .where('reservationService.reservationId = :reservationId', { reservationId })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getServiceStatistics(propertyId, startDate, endDate) {
        const queryBuilder = this.reservationServiceRepository
            .createQueryBuilder('reservationService')
            .leftJoin('reservationService.propertyService', 'propertyService')
            .leftJoin('propertyService.service', 'service')
            .leftJoin('reservationService.reservation', 'reservation')
            .select([
            'service.name as serviceName',
            'COUNT(reservationService.id) as usage',
            'SUM(reservationService.totalPrice) as revenue',
            'AVG(reservationService.totalPrice) as avgPrice',
        ])
            .groupBy('service.id, service.name');
        if (propertyId) {
            queryBuilder.andWhere('propertyService.propertyId = :propertyId', { propertyId });
        }
        if (startDate) {
            queryBuilder.andWhere('reservationService.dateProvided >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('reservationService.dateProvided <= :endDate', { endDate });
        }
        return await queryBuilder.getRawMany();
    }
};
exports.ReservationServicesService = ReservationServicesService;
exports.ReservationServicesService = ReservationServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_service_entity_1.ReservationService)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReservationServicesService);
//# sourceMappingURL=reservation-services.service.js.map