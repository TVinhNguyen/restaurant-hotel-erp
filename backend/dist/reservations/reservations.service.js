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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("../entities/reservation/reservation.entity");
let ReservationsService = class ReservationsService {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, propertyId, status, checkInFrom, checkInTo, guestId } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.reservationRepository.createQueryBuilder('reservation')
            .leftJoinAndSelect('reservation.property', 'property')
            .leftJoinAndSelect('reservation.guest', 'guest')
            .leftJoinAndSelect('reservation.roomType', 'roomType')
            .leftJoinAndSelect('reservation.assignedRoom', 'assignedRoom')
            .leftJoinAndSelect('reservation.ratePlan', 'ratePlan');
        if (propertyId) {
            queryBuilder.andWhere('reservation.propertyId = :propertyId', { propertyId });
        }
        if (status) {
            queryBuilder.andWhere('reservation.status = :status', { status });
        }
        if (guestId) {
            queryBuilder.andWhere('reservation.guestId = :guestId', { guestId });
        }
        if (checkInFrom) {
            queryBuilder.andWhere('reservation.checkInDate >= :checkInFrom', { checkInFrom });
        }
        if (checkInTo) {
            queryBuilder.andWhere('reservation.checkInDate <= :checkInTo', { checkInTo });
        }
        const [data, total] = await queryBuilder
            .orderBy('reservation.checkInDate', 'DESC')
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
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: ['property', 'guest', 'roomType', 'assignedRoom', 'ratePlan', 'payments'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation with ID ${id} not found`);
        }
        return reservation;
    }
    async create(createReservationDto) {
        const confirmationNumber = this.generateConfirmationNumber();
        const reservation = this.reservationRepository.create({
            ...createReservationDto,
            confirmationNumber,
            status: 'confirmed',
        });
        return await this.reservationRepository.save(reservation);
    }
    async update(id, updateReservationDto) {
        const reservation = await this.findOne(id);
        Object.assign(reservation, updateReservationDto);
        return await this.reservationRepository.save(reservation);
    }
    async checkIn(id, roomId) {
        const reservation = await this.findOne(id);
        if (reservation.status !== 'confirmed') {
            throw new common_1.BadRequestException('Reservation must be confirmed to check in');
        }
        const today = new Date().toISOString().split('T')[0];
        const checkInDate = reservation.checkInDate.toISOString().split('T')[0];
        if (checkInDate > today) {
            throw new common_1.BadRequestException('Cannot check in before check-in date');
        }
        reservation.status = 'checked_in';
        if (roomId) {
            reservation.assignedRoomId = roomId;
        }
        return await this.reservationRepository.save(reservation);
    }
    async checkOut(id) {
        const reservation = await this.findOne(id);
        if (reservation.status !== 'checked_in') {
            throw new common_1.BadRequestException('Reservation must be checked in to check out');
        }
        reservation.status = 'checked_out';
        return await this.reservationRepository.save(reservation);
    }
    async assignRoom(id, roomId) {
        const reservation = await this.findOne(id);
        if (reservation.status === 'cancelled' || reservation.status === 'checked_out') {
            throw new common_1.BadRequestException('Cannot assign room to cancelled or checked out reservation');
        }
        reservation.assignedRoomId = roomId;
        return await this.reservationRepository.save(reservation);
    }
    async cancel(id) {
        const reservation = await this.findOne(id);
        if (reservation.status === 'checked_in' || reservation.status === 'checked_out') {
            throw new common_1.BadRequestException('Cannot cancel checked in or checked out reservation');
        }
        reservation.status = 'cancelled';
        return await this.reservationRepository.save(reservation);
    }
    async remove(id) {
        const reservation = await this.findOne(id);
        await this.reservationRepository.remove(reservation);
    }
    generateConfirmationNumber() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `RES${timestamp.slice(-6)}${random}`;
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map