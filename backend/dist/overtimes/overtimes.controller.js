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
exports.OvertimesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const overtimes_service_1 = require("./overtimes.service");
const create_overtime_dto_1 = require("./dto/create-overtime.dto");
const update_overtime_dto_1 = require("./dto/update-overtime.dto");
let OvertimesController = class OvertimesController {
    overtimesService;
    constructor(overtimesService) {
        this.overtimesService = overtimesService;
    }
    async create(createOvertimeDto) {
        return this.overtimesService.create(createOvertimeDto);
    }
    async findAll(page, limit, employeeId, workingShiftId, approvedBy) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.overtimesService.findAll(pageNum, limitNum, employeeId, workingShiftId, approvedBy);
    }
    async findByEmployee(employeeId, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.overtimesService.findByEmployee(employeeId, pageNum, limitNum);
    }
    async findByWorkingShift(workingShiftId, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.overtimesService.findByWorkingShift(workingShiftId, pageNum, limitNum);
    }
    async findByApprover(approvedBy, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.overtimesService.findByApprover(approvedBy, pageNum, limitNum);
    }
    async getTotalOvertimeByEmployee(employeeId) {
        return this.overtimesService.getTotalOvertimeByEmployee(employeeId);
    }
    async calculateOvertimeAmount(body) {
        const amount = await this.overtimesService.calculateOvertimeAmount(body.numberOfHours, body.rate);
        return {
            numberOfHours: body.numberOfHours,
            rate: body.rate,
            amount
        };
    }
    async findOne(id) {
        return this.overtimesService.findOne(id);
    }
    async update(id, updateOvertimeDto) {
        return this.overtimesService.update(id, updateOvertimeDto);
    }
    async remove(id) {
        await this.overtimesService.remove(id);
        return { message: 'Overtime deleted successfully' };
    }
};
exports.OvertimesController = OvertimesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_overtime_dto_1.CreateOvertimeDto]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, common_1.Query)('workingShiftId')),
    __param(4, (0, common_1.Query)('approvedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)('working-shift/:workingShiftId'),
    __param(0, (0, common_1.Param)('workingShiftId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "findByWorkingShift", null);
__decorate([
    (0, common_1.Get)('approver/:approvedBy'),
    __param(0, (0, common_1.Param)('approvedBy', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "findByApprover", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/total'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "getTotalOvertimeByEmployee", null);
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "calculateOvertimeAmount", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_overtime_dto_1.UpdateOvertimeDto]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OvertimesController.prototype, "remove", null);
exports.OvertimesController = OvertimesController = __decorate([
    (0, common_1.Controller)('overtimes'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [overtimes_service_1.OvertimesService])
], OvertimesController);
//# sourceMappingURL=overtimes.controller.js.map