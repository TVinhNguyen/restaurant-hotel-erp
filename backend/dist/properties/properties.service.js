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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("../entities/core/property.entity");
let PropertiesService = class PropertiesService {
    propertyRepository;
    constructor(propertyRepository) {
        this.propertyRepository = propertyRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, type } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.propertyRepository.createQueryBuilder('property');
        if (type) {
            queryBuilder.where('property.propertyType = :type', { type });
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
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['roomTypes', 'rooms', 'restaurants'],
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return property;
    }
    async create(createPropertyDto) {
        const property = this.propertyRepository.create(createPropertyDto);
        return await this.propertyRepository.save(property);
    }
    async update(id, updatePropertyDto) {
        const property = await this.findOne(id);
        Object.assign(property, updatePropertyDto);
        return await this.propertyRepository.save(property);
    }
    async remove(id) {
        const property = await this.findOne(id);
        await this.propertyRepository.remove(property);
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map