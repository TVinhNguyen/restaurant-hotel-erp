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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_service_entity_1 = require("../entities/reservation/property-service.entity");
const service_entity_1 = require("../entities/reservation/service.entity");
let ServicesService = class ServicesService {
    propertyServiceRepository;
    serviceRepository;
    constructor(propertyServiceRepository, serviceRepository) {
        this.propertyServiceRepository = propertyServiceRepository;
        this.serviceRepository = serviceRepository;
    }
    async findAllServices(query) {
        const { page = 1, limit = 10, category } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.serviceRepository.createQueryBuilder('service');
        if (category) {
            queryBuilder.where('service.category = :category', { category });
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
    async findAllPropertyServices(query) {
        const { page = 1, limit = 10, propertyId, isActive } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.propertyServiceRepository.createQueryBuilder('propertyService')
            .leftJoinAndSelect('propertyService.property', 'property')
            .leftJoinAndSelect('propertyService.service', 'service');
        if (propertyId) {
            queryBuilder.where('propertyService.propertyId = :propertyId', { propertyId });
        }
        if (isActive !== undefined) {
            queryBuilder.andWhere('propertyService.isActive = :isActive', { isActive });
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
    async findOnePropertyService(id) {
        const propertyService = await this.propertyServiceRepository.findOne({
            where: { id },
            relations: ['property', 'service'],
        });
        if (!propertyService) {
            throw new common_1.NotFoundException(`Property service with ID ${id} not found`);
        }
        return propertyService;
    }
    async createPropertyService(createPropertyServiceDto) {
        const propertyService = this.propertyServiceRepository.create({
            ...createPropertyServiceDto,
            isActive: createPropertyServiceDto.isActive ?? true,
        });
        return await this.propertyServiceRepository.save(propertyService);
    }
    async updatePropertyService(id, updatePropertyServiceDto) {
        const propertyService = await this.findOnePropertyService(id);
        Object.assign(propertyService, updatePropertyServiceDto);
        return await this.propertyServiceRepository.save(propertyService);
    }
    async removePropertyService(id) {
        const propertyService = await this.findOnePropertyService(id);
        await this.propertyServiceRepository.remove(propertyService);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_service_entity_1.PropertyService)),
    __param(1, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map