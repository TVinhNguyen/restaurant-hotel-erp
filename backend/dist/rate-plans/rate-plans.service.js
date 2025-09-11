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
exports.RatePlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rate_plan_entity_1 = require("../entities/reservation/rate-plan.entity");
const daily_rate_entity_1 = require("../entities/reservation/daily-rate.entity");
let RatePlansService = class RatePlansService {
    ratePlanRepository;
    dailyRateRepository;
    constructor(ratePlanRepository, dailyRateRepository) {
        this.ratePlanRepository = ratePlanRepository;
        this.dailyRateRepository = dailyRateRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, propertyId, roomTypeId } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.ratePlanRepository.createQueryBuilder('ratePlan')
            .leftJoinAndSelect('ratePlan.property', 'property')
            .leftJoinAndSelect('ratePlan.roomType', 'roomType');
        if (propertyId) {
            queryBuilder.andWhere('ratePlan.propertyId = :propertyId', { propertyId });
        }
        if (roomTypeId) {
            queryBuilder.andWhere('ratePlan.roomTypeId = :roomTypeId', { roomTypeId });
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
        const ratePlan = await this.ratePlanRepository.findOne({
            where: { id },
            relations: ['property', 'roomType', 'dailyRates'],
        });
        if (!ratePlan) {
            throw new common_1.NotFoundException(`Rate plan with ID ${id} not found`);
        }
        return ratePlan;
    }
    async create(createRatePlanDto) {
        const ratePlan = this.ratePlanRepository.create({
            ...createRatePlanDto,
            isRefundable: createRatePlanDto.isRefundable ?? true,
        });
        return await this.ratePlanRepository.save(ratePlan);
    }
    async update(id, updateRatePlanDto) {
        const ratePlan = await this.findOne(id);
        Object.assign(ratePlan, updateRatePlanDto);
        return await this.ratePlanRepository.save(ratePlan);
    }
    async remove(id) {
        const ratePlan = await this.findOne(id);
        await this.ratePlanRepository.remove(ratePlan);
    }
    async setDailyRate(ratePlanId, date, rate) {
        const existingRate = await this.dailyRateRepository.findOne({
            where: { ratePlanId, date: new Date(date) },
        });
        if (existingRate) {
            existingRate.price = rate;
            return await this.dailyRateRepository.save(existingRate);
        }
        const dailyRate = this.dailyRateRepository.create({
            ratePlanId,
            date: new Date(date),
            price: rate,
        });
        return await this.dailyRateRepository.save(dailyRate);
    }
    async getDailyRates(ratePlanId, startDate, endDate) {
        const queryBuilder = this.dailyRateRepository.createQueryBuilder('dailyRate')
            .where('dailyRate.ratePlanId = :ratePlanId', { ratePlanId });
        if (startDate) {
            queryBuilder.andWhere('dailyRate.date >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('dailyRate.date <= :endDate', { endDate });
        }
        return await queryBuilder
            .orderBy('dailyRate.date', 'ASC')
            .getMany();
    }
};
exports.RatePlansService = RatePlansService;
exports.RatePlansService = RatePlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rate_plan_entity_1.RatePlan)),
    __param(1, (0, typeorm_1.InjectRepository)(daily_rate_entity_1.DailyRate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RatePlansService);
//# sourceMappingURL=rate-plans.service.js.map