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
exports.EmployeeEvaluationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const employee_evaluations_service_1 = require("./employee-evaluations.service");
const create_employee_evaluation_dto_1 = require("./dto/create-employee-evaluation.dto");
const update_employee_evaluation_dto_1 = require("./dto/update-employee-evaluation.dto");
let EmployeeEvaluationsController = class EmployeeEvaluationsController {
    employeeEvaluationsService;
    constructor(employeeEvaluationsService) {
        this.employeeEvaluationsService = employeeEvaluationsService;
    }
    async create(createEmployeeEvaluationDto) {
        return this.employeeEvaluationsService.create(createEmployeeEvaluationDto);
    }
    async findAll(page, limit, employeeId, evaluatedBy, period, rateMin, rateMax) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const rateMinNum = rateMin ? parseInt(rateMin, 10) : undefined;
        const rateMaxNum = rateMax ? parseInt(rateMax, 10) : undefined;
        return this.employeeEvaluationsService.findAll(pageNum, limitNum, employeeId, evaluatedBy, period, rateMinNum, rateMaxNum);
    }
    async findByEmployee(employeeId, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.employeeEvaluationsService.findByEmployee(employeeId, pageNum, limitNum);
    }
    async findByEvaluator(evaluatedBy, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.employeeEvaluationsService.findByEvaluator(evaluatedBy, pageNum, limitNum);
    }
    async findByPeriod(period, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.employeeEvaluationsService.findByPeriod(period, pageNum, limitNum);
    }
    async findByRateRange(rateMin, rateMax, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const rateMinNum = parseInt(rateMin, 10);
        const rateMaxNum = parseInt(rateMax, 10);
        return this.employeeEvaluationsService.findByRateRange(rateMinNum, rateMaxNum, pageNum, limitNum);
    }
    async getAverageRateByEmployee(employeeId) {
        return this.employeeEvaluationsService.getAverageRateByEmployee(employeeId);
    }
    async getEvaluationStatsByPeriod(period) {
        return this.employeeEvaluationsService.getEvaluationStatsByPeriod(period);
    }
    async findOne(id) {
        return this.employeeEvaluationsService.findOne(id);
    }
    async update(id, updateEmployeeEvaluationDto) {
        return this.employeeEvaluationsService.update(id, updateEmployeeEvaluationDto);
    }
    async remove(id) {
        await this.employeeEvaluationsService.remove(id);
        return { message: 'Employee evaluation deleted successfully' };
    }
};
exports.EmployeeEvaluationsController = EmployeeEvaluationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_evaluation_dto_1.CreateEmployeeEvaluationDto]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, common_1.Query)('evaluatedBy')),
    __param(4, (0, common_1.Query)('period')),
    __param(5, (0, common_1.Query)('rateMin')),
    __param(6, (0, common_1.Query)('rateMax')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)('evaluator/:evaluatedBy'),
    __param(0, (0, common_1.Param)('evaluatedBy', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "findByEvaluator", null);
__decorate([
    (0, common_1.Get)('period/:period'),
    __param(0, (0, common_1.Param)('period')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "findByPeriod", null);
__decorate([
    (0, common_1.Get)('rate-range'),
    __param(0, (0, common_1.Query)('rateMin')),
    __param(1, (0, common_1.Query)('rateMax')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "findByRateRange", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/average'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "getAverageRateByEmployee", null);
__decorate([
    (0, common_1.Get)('stats/period/:period'),
    __param(0, (0, common_1.Param)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "getEvaluationStatsByPeriod", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_employee_evaluation_dto_1.UpdateEmployeeEvaluationDto]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeEvaluationsController.prototype, "remove", null);
exports.EmployeeEvaluationsController = EmployeeEvaluationsController = __decorate([
    (0, common_1.Controller)('employee-evaluations'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [employee_evaluations_service_1.EmployeeEvaluationsService])
], EmployeeEvaluationsController);
//# sourceMappingURL=employee-evaluations.controller.js.map