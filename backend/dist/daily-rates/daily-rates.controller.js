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
exports.DailyRatesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const daily_rates_service_1 = require("./daily-rates.service");
const create_daily_rate_dto_1 = require("./dto/create-daily-rate.dto");
const update_daily_rate_dto_1 = require("./dto/update-daily-rate.dto");
let DailyRatesController = class DailyRatesController {
    dailyRatesService;
    constructor(dailyRatesService) {
        this.dailyRatesService = dailyRatesService;
    }
    async findAll(page, limit, ratePlanId, startDate, endDate) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return await this.dailyRatesService.findAll({
            page: pageNum,
            limit: limitNum,
            ratePlanId,
            startDate,
            endDate,
        });
    }
    async findOne(id) {
        return await this.dailyRatesService.findOne(id);
    }
    async create(createDailyRateDto) {
        return await this.dailyRatesService.create(createDailyRateDto);
    }
    async update(id, updateDailyRateDto) {
        return await this.dailyRatesService.update(id, updateDailyRateDto);
    }
    async remove(id) {
        await this.dailyRatesService.remove(id);
        return { message: 'Daily rate deleted successfully' };
    }
    async findByRatePlan(ratePlanId, startDate, endDate) {
        return await this.dailyRatesService.findByRatePlanAndDateRange(ratePlanId, startDate || '', endDate || '');
    }
};
exports.DailyRatesController = DailyRatesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('ratePlanId')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DailyRatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DailyRatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_daily_rate_dto_1.CreateDailyRateDto]),
    __metadata("design:returntype", Promise)
], DailyRatesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_daily_rate_dto_1.UpdateDailyRateDto]),
    __metadata("design:returntype", Promise)
], DailyRatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DailyRatesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('rate-plan/:ratePlanId'),
    __param(0, (0, common_1.Param)('ratePlanId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DailyRatesController.prototype, "findByRatePlan", null);
exports.DailyRatesController = DailyRatesController = __decorate([
    (0, common_1.Controller)('daily-rates'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [daily_rates_service_1.DailyRatesService])
], DailyRatesController);
//# sourceMappingURL=daily-rates.controller.js.map