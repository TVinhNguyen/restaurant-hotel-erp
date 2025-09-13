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
exports.DailyRatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_rate_entity_1 = require("../entities/reservation/daily-rate.entity");
let DailyRatesService = class DailyRatesService {
    dailyRateRepository;
    constructor(dailyRateRepository) {
        this.dailyRateRepository = dailyRateRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, ratePlanId, startDate, endDate } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.dailyRateRepository.createQueryBuilder('dailyRate')
            .leftJoinAndSelect('dailyRate.ratePlan', 'ratePlan');
        if (ratePlanId) {
            queryBuilder.andWhere('dailyRate.ratePlanId = :ratePlanId', { ratePlanId });
        }
        if (startDate) {
            queryBuilder.andWhere('dailyRate.date >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('dailyRate.date <= :endDate', { endDate });
        }
        const [data, total] = await queryBuilder
            .orderBy('dailyRate.date', 'ASC')
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
        const dailyRate = await this.dailyRateRepository.findOne({
            where: { id },
            relations: ['ratePlan'],
        });
        if (!dailyRate) {
            throw new common_1.NotFoundException(`Daily rate with ID ${id} not found`);
        }
        return dailyRate;
    }
    async create(createDailyRateDto) {
        const dailyRate = this.dailyRateRepository.create({
            ...createDailyRateDto,
            date: new Date(createDailyRateDto.date),
        });
        return await this.dailyRateRepository.save(dailyRate);
    }
    async update(id, updateDailyRateDto) {
        const dailyRate = await this.findOne(id);
        if (updateDailyRateDto.date) {
            updateDailyRateDto.date = new Date(updateDailyRateDto.date).toISOString();
        }
        Object.assign(dailyRate, updateDailyRateDto);
        return await this.dailyRateRepository.save(dailyRate);
    }
    async remove(id) {
        const dailyRate = await this.findOne(id);
        await this.dailyRateRepository.remove(dailyRate);
    }
    async findByRatePlanAndDateRange(ratePlanId, startDate, endDate) {
        const queryBuilder = this.dailyRateRepository.createQueryBuilder('dailyRate')
            .where('dailyRate.ratePlanId = :ratePlanId', { ratePlanId });
        if (startDate && endDate) {
            queryBuilder.andWhere('dailyRate.date BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }
        return await queryBuilder
            .orderBy('dailyRate.date', 'ASC')
            .getMany();
    }
};
exports.DailyRatesService = DailyRatesService;
exports.DailyRatesService = DailyRatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_rate_entity_1.DailyRate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DailyRatesService);
//# sourceMappingURL=daily-rates.service.js.map