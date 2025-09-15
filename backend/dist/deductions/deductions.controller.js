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
exports.DeductionsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const deductions_service_1 = require("./deductions.service");
const create_deduction_dto_1 = require("./dto/create-deduction.dto");
const update_deduction_dto_1 = require("./dto/update-deduction.dto");
let DeductionsController = class DeductionsController {
    deductionsService;
    constructor(deductionsService) {
        this.deductionsService = deductionsService;
    }
    async create(createDeductionDto) {
        return this.deductionsService.create(createDeductionDto);
    }
    async findAll(page, limit, employeeId, type, startDate, endDate) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.deductionsService.findAll(pageNum, limitNum, employeeId, type, startDate, endDate);
    }
    async findByEmployee(employeeId, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.deductionsService.findByEmployee(employeeId, pageNum, limitNum);
    }
    async findByType(type, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.deductionsService.findByType(type, pageNum, limitNum);
    }
    async findByDateRange(startDate, endDate, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.deductionsService.findByDateRange(startDate, endDate, pageNum, limitNum);
    }
    async getTotalDeductionsByEmployee(employeeId, startDate, endDate) {
        return this.deductionsService.getTotalDeductionsByEmployee(employeeId, startDate, endDate);
    }
    async findOne(id) {
        return this.deductionsService.findOne(id);
    }
    async update(id, updateDeductionDto) {
        return this.deductionsService.update(id, updateDeductionDto);
    }
    async remove(id) {
        await this.deductionsService.remove(id);
        return { message: 'Deduction deleted successfully' };
    }
};
exports.DeductionsController = DeductionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deduction_dto_1.CreateDeductionDto]),
    __metadata("design:returntype", Promise)
], DeductionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DeductionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DeductionsController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DeductionsController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)('date-range'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], DeductionsController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/total'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DeductionsController.prototype, "getTotalDeductionsByEmployee", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeductionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_deduction_dto_1.UpdateDeductionDto]),
    __metadata("design:returntype", Promise)
], DeductionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeductionsController.prototype, "remove", null);
exports.DeductionsController = DeductionsController = __decorate([
    (0, common_1.Controller)('deductions'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [deductions_service_1.DeductionsService])
], DeductionsController);
//# sourceMappingURL=deductions.controller.js.map