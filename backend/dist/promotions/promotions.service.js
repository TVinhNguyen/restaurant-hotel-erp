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
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promotion_entity_1 = require("../entities/reservation/promotion.entity");
let PromotionsService = class PromotionsService {
    promotionRepository;
    constructor(promotionRepository) {
        this.promotionRepository = promotionRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, propertyId, active } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.promotionRepository.createQueryBuilder('promotion')
            .leftJoinAndSelect('promotion.property', 'property');
        if (propertyId) {
            queryBuilder.andWhere('promotion.propertyId = :propertyId', { propertyId });
        }
        if (active !== undefined) {
            const currentDate = new Date().toISOString().split('T')[0];
            if (active) {
                queryBuilder.andWhere('promotion.validFrom <= :currentDate', { currentDate })
                    .andWhere('promotion.validTo >= :currentDate', { currentDate });
            }
            else {
                queryBuilder.andWhere('(promotion.validFrom > :currentDate OR promotion.validTo < :currentDate)', { currentDate });
            }
        }
        const [data, total] = await queryBuilder
            .orderBy('promotion.validFrom', 'DESC')
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
        const promotion = await this.promotionRepository.findOne({
            where: { id },
            relations: ['property', 'reservations'],
        });
        if (!promotion) {
            throw new common_1.NotFoundException(`Promotion with ID ${id} not found`);
        }
        return promotion;
    }
    async findByCode(code) {
        const promotion = await this.promotionRepository.findOne({
            where: { code },
            relations: ['property'],
        });
        if (!promotion) {
            throw new common_1.NotFoundException(`Promotion with code ${code} not found`);
        }
        return promotion;
    }
    async create(createPromotionDto) {
        const existingPromotion = await this.promotionRepository.findOne({
            where: { code: createPromotionDto.code },
        });
        if (existingPromotion) {
            throw new common_1.ConflictException(`Promotion with code ${createPromotionDto.code} already exists`);
        }
        const entityData = {
            propertyId: createPromotionDto.propertyId,
            code: createPromotionDto.code,
            name: createPromotionDto.name,
            discountType: createPromotionDto.discountType,
            discountValue: createPromotionDto.discountValue,
            validFrom: createPromotionDto.validFrom ? new Date(createPromotionDto.validFrom) : undefined,
            validTo: createPromotionDto.validTo ? new Date(createPromotionDto.validTo) : undefined,
            isActive: createPromotionDto.isActive ?? true,
        };
        const promotion = this.promotionRepository.create(entityData);
        return await this.promotionRepository.save(promotion);
    }
    async update(id, updatePromotionDto) {
        const promotion = await this.findOne(id);
        if (updatePromotionDto.code && updatePromotionDto.code !== promotion.code) {
            const existingPromotion = await this.promotionRepository.findOne({
                where: { code: updatePromotionDto.code },
            });
            if (existingPromotion && existingPromotion.id !== id) {
                throw new common_1.ConflictException(`Promotion with code ${updatePromotionDto.code} already exists`);
            }
        }
        if (updatePromotionDto.propertyId !== undefined) {
            promotion.propertyId = updatePromotionDto.propertyId;
        }
        if (updatePromotionDto.code !== undefined) {
            promotion.code = updatePromotionDto.code;
        }
        if (updatePromotionDto.name !== undefined) {
            promotion.name = updatePromotionDto.name;
        }
        if (updatePromotionDto.discountType !== undefined) {
            promotion.discountType = updatePromotionDto.discountType;
        }
        if (updatePromotionDto.discountValue !== undefined) {
            promotion.discountValue = updatePromotionDto.discountValue;
        }
        if (updatePromotionDto.validFrom !== undefined) {
            promotion.validFrom = new Date(updatePromotionDto.validFrom);
        }
        if (updatePromotionDto.validTo !== undefined) {
            promotion.validTo = new Date(updatePromotionDto.validTo);
        }
        if (updatePromotionDto.isActive !== undefined) {
            promotion.isActive = updatePromotionDto.isActive;
        }
        return await this.promotionRepository.save(promotion);
    }
    async remove(id) {
        const promotion = await this.findOne(id);
        await this.promotionRepository.remove(promotion);
    }
    async validatePromotion(code, propertyId) {
        try {
            const promotion = await this.findByCode(code);
            if (promotion.propertyId !== propertyId) {
                return { valid: false, error: 'Promotion not valid for this property' };
            }
            const currentDate = new Date();
            const validFrom = promotion.validFrom ? new Date(promotion.validFrom) : null;
            const validTo = promotion.validTo ? new Date(promotion.validTo) : null;
            if (validFrom && currentDate < validFrom) {
                return { valid: false, error: 'Promotion not yet active' };
            }
            if (validTo && currentDate > validTo) {
                return { valid: false, error: 'Promotion has expired' };
            }
            return { valid: true, promotion };
        }
        catch (error) {
            return { valid: false, error: 'Promotion not found' };
        }
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(promotion_entity_1.Promotion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map