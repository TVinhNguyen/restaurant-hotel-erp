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
const room_type_amenity_entity_1 = require("../entities/inventory/room-type-amenity.entity");
const amenity_entity_1 = require("../entities/inventory/amenity.entity");
let RoomTypesService = class RoomTypesService {
    roomTypeRepository;
    roomTypeAmenityRepository;
    amenityRepository;
    constructor(roomTypeRepository, roomTypeAmenityRepository, amenityRepository) {
        this.roomTypeRepository = roomTypeRepository;
        this.roomTypeAmenityRepository = roomTypeAmenityRepository;
        this.amenityRepository = amenityRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, propertyId, search } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.roomTypeRepository.createQueryBuilder('roomType')
            .leftJoinAndSelect('roomType.property', 'property')
            .leftJoinAndSelect('roomType.roomTypeAmenities', 'roomTypeAmenities')
            .leftJoinAndSelect('roomTypeAmenities.amenity', 'amenity')
            .leftJoinAndSelect('roomType.photos', 'photos')
            .leftJoinAndSelect('roomType.rooms', 'rooms');
        if (propertyId) {
            queryBuilder.where('roomType.propertyId = :propertyId', { propertyId });
        }
        if (search) {
            queryBuilder.andWhere('(roomType.name ILIKE :search OR roomType.description ILIKE :search)', { search: `%${search}%` });
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
            relations: ['property', 'rooms', 'roomTypeAmenities', 'roomTypeAmenities.amenity', 'photos'],
        });
        if (!roomType) {
            throw new common_1.NotFoundException(`Room type with ID ${id} not found`);
        }
        return roomType;
    }
    async create(createRoomTypeDto) {
        const { amenityIds, ...roomTypeData } = createRoomTypeDto;
        const roomType = this.roomTypeRepository.create(roomTypeData);
        const savedRoomType = await this.roomTypeRepository.save(roomType);
        if (amenityIds && amenityIds.length > 0) {
            await this.addMultipleAmenities(savedRoomType.id, amenityIds);
        }
        return await this.findOne(savedRoomType.id);
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
    async addAmenity(roomTypeId, amenityId) {
        const roomType = await this.findOne(roomTypeId);
        const amenity = await this.amenityRepository.findOne({ where: { id: amenityId } });
        if (!amenity) {
            throw new common_1.NotFoundException(`Amenity with ID ${amenityId} not found`);
        }
        const existingAssociation = await this.roomTypeAmenityRepository.findOne({
            where: { roomTypeId, amenityId },
        });
        if (existingAssociation) {
            throw new common_1.ConflictException('Amenity is already associated with this room type');
        }
        const roomTypeAmenity = this.roomTypeAmenityRepository.create({
            roomTypeId,
            amenityId,
        });
        await this.roomTypeAmenityRepository.save(roomTypeAmenity);
        return {
            roomTypeId,
            amenityId,
            amenity: {
                id: amenity.id,
                name: amenity.name,
                category: amenity.category,
            },
        };
    }
    async removeAmenity(roomTypeId, amenityId) {
        await this.findOne(roomTypeId);
        const association = await this.roomTypeAmenityRepository.findOne({
            where: { roomTypeId, amenityId },
        });
        if (!association) {
            throw new common_1.NotFoundException('Amenity association not found');
        }
        await this.roomTypeAmenityRepository.remove(association);
    }
    async addMultipleAmenities(roomTypeId, amenityIds) {
        await this.findOne(roomTypeId);
        const amenities = await this.amenityRepository.findByIds(amenityIds);
        if (amenities.length !== amenityIds.length) {
            throw new common_1.NotFoundException('One or more amenities not found');
        }
        const existingAssociations = await this.roomTypeAmenityRepository.find({
            where: { roomTypeId },
        });
        const existingAmenityIds = existingAssociations.map(assoc => assoc.amenityId);
        const newAmenityIds = amenityIds.filter(id => !existingAmenityIds.includes(id));
        if (newAmenityIds.length === 0) {
            return {
                roomTypeId,
                addedAmenities: [],
                createdCount: 0,
                message: 'All amenities are already associated with this room type',
            };
        }
        const newAssociations = newAmenityIds.map(amenityId => this.roomTypeAmenityRepository.create({ roomTypeId, amenityId }));
        await this.roomTypeAmenityRepository.save(newAssociations);
        const addedAmenities = amenities
            .filter(amenity => newAmenityIds.includes(amenity.id))
            .map(amenity => ({
            amenityId: amenity.id,
            name: amenity.name,
        }));
        return {
            roomTypeId,
            addedAmenities,
            createdCount: newAmenityIds.length,
        };
    }
};
exports.RoomTypesService = RoomTypesService;
exports.RoomTypesService = RoomTypesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_type_entity_1.RoomType)),
    __param(1, (0, typeorm_1.InjectRepository)(room_type_amenity_entity_1.RoomTypeAmenity)),
    __param(2, (0, typeorm_1.InjectRepository)(amenity_entity_1.Amenity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoomTypesService);
//# sourceMappingURL=room-types.service.js.map