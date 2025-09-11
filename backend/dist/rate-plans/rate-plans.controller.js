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
exports.RatePlansController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const rate_plans_service_1 = require("./rate-plans.service");
const create_rate_plan_dto_1 = require("./dto/create-rate-plan.dto");
const update_rate_plan_dto_1 = require("./dto/update-rate-plan.dto");
let RatePlansController = class RatePlansController {
    ratePlansService;
    constructor(ratePlansService) {
        this.ratePlansService = ratePlansService;
    }
    async findAll(page, limit, propertyId, roomTypeId) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return await this.ratePlansService.findAll({
            page: pageNum,
            limit: limitNum,
            propertyId,
            roomTypeId,
        });
    }
    async findOne(id) {
        return await this.ratePlansService.findOne(id);
    }
    async create(createRatePlanDto) {
        return await this.ratePlansService.create(createRatePlanDto);
    }
    async update(id, updateRatePlanDto) {
        return await this.ratePlansService.update(id, updateRatePlanDto);
    }
    async remove(id) {
        await this.ratePlansService.remove(id);
        return { message: 'Rate plan deleted successfully' };
    }
    async setDailyRate(ratePlanId, body) {
        return await this.ratePlansService.setDailyRate(ratePlanId, body.date, body.rate);
    }
    async getDailyRates(ratePlanId, startDate, endDate) {
        return await this.ratePlansService.getDailyRates(ratePlanId, startDate, endDate);
    }
};
exports.RatePlansController = RatePlansController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('propertyId')),
    __param(3, (0, common_1.Query)('roomTypeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], RatePlansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RatePlansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rate_plan_dto_1.CreateRatePlanDto]),
    __metadata("design:returntype", Promise)
], RatePlansController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rate_plan_dto_1.UpdateRatePlanDto]),
    __metadata("design:returntype", Promise)
], RatePlansController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RatePlansController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/daily-rates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RatePlansController.prototype, "setDailyRate", null);
__decorate([
    (0, common_1.Get)(':id/daily-rates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RatePlansController.prototype, "getDailyRates", null);
exports.RatePlansController = RatePlansController = __decorate([
    (0, common_1.Controller)('rate-plans'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [rate_plans_service_1.RatePlansService])
], RatePlansController);
//# sourceMappingURL=rate-plans.controller.js.map