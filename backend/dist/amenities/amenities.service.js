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
exports.AmenitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const amenity_entity_1 = require("../entities/inventory/amenity.entity");
let AmenitiesService = class AmenitiesService {
    amenityRepository;
    constructor(amenityRepository) {
        this.amenityRepository = amenityRepository;
    }
    async create(createAmenityDto) {
        const amenity = this.amenityRepository.create(createAmenityDto);
        return await this.amenityRepository.save(amenity);
    }
    async findAll(query) {
        const { page = 1, limit = 10, category, search } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.amenityRepository.createQueryBuilder('amenity')
            .leftJoinAndSelect('amenity.roomTypeAmenities', 'roomTypeAmenities')
            .leftJoinAndSelect('roomTypeAmenities.roomType', 'roomType')
            .leftJoinAndSelect('roomType.property', 'property');
        if (category) {
            queryBuilder.where('amenity.category = :category', { category });
        }
        if (search) {
            queryBuilder.andWhere('amenity.name ILIKE :search', { search: `%${search}%` });
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
        };
    }
    async findOne(id) {
        const amenity = await this.amenityRepository.findOne({
            where: { id },
            relations: ['roomTypeAmenities', 'roomTypeAmenities.roomType', 'roomTypeAmenities.roomType.property'],
        });
        if (!amenity) {
            throw new common_1.NotFoundException(`Amenity with ID ${id} not found`);
        }
        return amenity;
    }
    async update(id, updateAmenityDto) {
        await this.findOne(id);
        await this.amenityRepository.update(id, updateAmenityDto);
        return await this.findOne(id);
    }
    async remove(id) {
        const amenity = await this.findOne(id);
        return await this.amenityRepository.remove(amenity);
    }
};
exports.AmenitiesService = AmenitiesService;
exports.AmenitiesService = AmenitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(amenity_entity_1.Amenity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AmenitiesService);
//# sourceMappingURL=amenities.service.js.map