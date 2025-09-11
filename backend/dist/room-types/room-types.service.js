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
exports.RoomTypesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_type_entity_1 = require("../entities/inventory/room-type.entity");
let RoomTypesService = class RoomTypesService {
    roomTypeRepository;
    constructor(roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, propertyId } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.roomTypeRepository.createQueryBuilder('roomType')
            .leftJoinAndSelect('roomType.property', 'property');
        if (propertyId) {
            queryBuilder.where('roomType.propertyId = :propertyId', { propertyId });
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
        const roomType = await this.roomTypeRepository.findOne({
            where: { id },
            relations: ['property', 'rooms', 'roomTypeAmenities', 'photos'],
        });
        if (!roomType) {
            throw new common_1.NotFoundException(`Room type with ID ${id} not found`);
        }
        return roomType;
    }
    async create(createRoomTypeDto) {
        const roomType = this.roomTypeRepository.create(createRoomTypeDto);
        return await this.roomTypeRepository.save(roomType);
    }
    async update(id, updateRoomTypeDto) {
        const roomType = await this.findOne(id);
        Object.assign(roomType, updateRoomTypeDto);
        return await this.roomTypeRepository.save(roomType);
    }
    async remove(id) {
        const roomType = await this.findOne(id);
        await this.roomTypeRepository.remove(roomType);
    }
};
exports.RoomTypesService = RoomTypesService;
exports.RoomTypesService = RoomTypesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_type_entity_1.RoomType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomTypesService);
//# sourceMappingURL=room-types.service.js.map