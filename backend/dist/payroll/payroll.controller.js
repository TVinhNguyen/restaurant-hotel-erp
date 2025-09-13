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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const payroll_service_1 = require("./payroll.service");
const create_payroll_dto_1 = require("./dto/create-payroll.dto");
let PayrollController = class PayrollController {
    payrollService;
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async createPayroll(createPayrollDto) {
        return this.payrollService.createPayroll(createPayrollDto);
    }
    async bulkCreatePayroll(bulkPayrollDto) {
        return this.payrollService.bulkCreatePayroll(bulkPayrollDto);
    }
    async generatePayrollWithCalculations(period, employeeId) {
        return this.payrollService.generatePayrollWithCalculations(period, employeeId);
    }
    async findAllPayrolls(page = 1, limit = 10, employeeId, period) {
        return this.payrollService.findAllPayrolls(page, limit, employeeId, period);
    }
    async getPayrollSummary(period, employeeId) {
        return this.payrollService.getPayrollSummary(period, employeeId);
    }
    async findPayrollById(id) {
        return this.payrollService.findPayrollById(id);
    }
    async updatePayroll(id, updatePayrollDto) {
        return this.payrollService.updatePayroll(id, updatePayrollDto);
    }
    async deletePayroll(id) {
        await this.payrollService.deletePayroll(id);
        return { message: 'Payroll record deleted successfully' };
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payroll_dto_1.CreatePayrollDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "createPayroll", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payroll_dto_1.BulkPayrollDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "bulkCreatePayroll", null);
__decorate([
    (0, common_1.Post)('generate/:period'),
    __param(0, (0, common_1.Param)('period')),
    __param(1, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "generatePayrollWithCalculations", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findAllPayrolls", null);
__decorate([
    (0, common_1.Get)('summary/:period'),
    __param(0, (0, common_1.Param)('period')),
    __param(1, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPayrollSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findPayrollById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_payroll_dto_1.UpdatePayrollDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "updatePayroll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "deletePayroll", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('payroll'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map