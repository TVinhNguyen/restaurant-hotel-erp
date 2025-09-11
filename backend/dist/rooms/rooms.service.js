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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("../entities/inventory/room.entity");
let RoomsService = class RoomsService {
    roomRepository;
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, propertyId, roomTypeId, status, floor } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.roomRepository.createQueryBuilder('room')
            .leftJoinAndSelect('room.property', 'property')
            .leftJoinAndSelect('room.roomType', 'roomType');
        if (propertyId) {
            queryBuilder.andWhere('room.propertyId = :propertyId', { propertyId });
        }
        if (roomTypeId) {
            queryBuilder.andWhere('room.roomTypeId = :roomTypeId', { roomTypeId });
        }
        if (status) {
            queryBuilder.andWhere('room.operationalStatus = :status', { status });
        }
        if (floor) {
            queryBuilder.andWhere('room.floor = :floor', { floor });
        }
        const [data, total] = await queryBuilder
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
    async findAvailable(query) {
        const { page = 1, limit = 10, propertyId, checkIn, checkOut } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.roomRepository.createQueryBuilder('room')
            .leftJoinAndSelect('room.property', 'property')
            .leftJoinAndSelect('room.roomType', 'roomType')
            .where('room.operationalStatus = :status', { status: 'available' });
        if (propertyId) {
            queryBuilder.andWhere('room.propertyId = :propertyId', { propertyId });
        }
        if (checkIn && checkOut) {
            queryBuilder.andWhere(`
        room.id NOT IN (
          SELECT DISTINCT r.assignedRoomId 
          FROM reservation.reservations r 
          WHERE r.assignedRoomId IS NOT NULL 
          AND r.status NOT IN ('cancelled', 'checked_out')
          AND (
            (r.checkInDate <= :checkIn AND r.checkOutDate > :checkIn) OR
            (r.checkInDate < :checkOut AND r.checkOutDate >= :checkOut) OR
            (r.checkInDate >= :checkIn AND r.checkOutDate <= :checkOut)
          )
        )
      `, { checkIn, checkOut });
        }
        const [data, total] = await queryBuilder
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
        const room = await this.roomRepository.findOne({
            where: { id },
            relations: ['property', 'roomType', 'reservations', 'statusHistory'],
        });
        if (!room) {
            throw new common_1.NotFoundException(`Room with ID ${id} not found`);
        }
        return room;
    }
    async create(createRoomDto) {
        const room = this.roomRepository.create(createRoomDto);
        return await this.roomRepository.save(room);
    }
    async update(id, updateRoomDto) {
        const room = await this.findOne(id);
        Object.assign(room, updateRoomDto);
        return await this.roomRepository.save(room);
    }
    async updateStatus(id, statusData) {
        const room = await this.findOne(id);
        Object.assign(room, statusData);
        return await this.roomRepository.save(room);
    }
    async remove(id) {
        const room = await this.findOne(id);
        await this.roomRepository.remove(room);
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map