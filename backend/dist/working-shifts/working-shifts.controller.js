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
exports.WorkingShiftsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const working_shifts_service_1 = require("./working-shifts.service");
const create_working_shift_dto_1 = require("./dto/create-working-shift.dto");
const update_working_shift_dto_1 = require("./dto/update-working-shift.dto");
let WorkingShiftsController = class WorkingShiftsController {
    workingShiftsService;
    constructor(workingShiftsService) {
        this.workingShiftsService = workingShiftsService;
    }
    async create(createWorkingShiftDto) {
        return this.workingShiftsService.create(createWorkingShiftDto);
    }
    async findAll(page, limit, employeeId, propertyId, date, shiftType) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.workingShiftsService.findAll(pageNum, limitNum, employeeId, propertyId, date, shiftType);
    }
    async findByEmployee(employeeId, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.workingShiftsService.findByEmployee(employeeId, pageNum, limitNum);
    }
    async findByProperty(propertyId, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.workingShiftsService.findByProperty(propertyId, pageNum, limitNum);
    }
    async findByDateRange(startDate, endDate, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.workingShiftsService.findByDateRange(startDate, endDate, pageNum, limitNum);
    }
    async findOne(id) {
        return this.workingShiftsService.findOne(id);
    }
    async update(id, updateWorkingShiftDto) {
        return this.workingShiftsService.update(id, updateWorkingShiftDto);
    }
    async remove(id) {
        await this.workingShiftsService.remove(id);
        return { message: 'Working shift deleted successfully' };
    }
};
exports.WorkingShiftsController = WorkingShiftsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_working_shift_dto_1.CreateWorkingShiftDto]),
    __metadata("design:returntype", Promise)
], WorkingShiftsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, common_1.Query)('propertyId')),
    __param(4, (0, common_1.Query)('date')),
    __param(5, (0, common_1.Query)('shiftType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], WorkingShiftsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], WorkingShiftsController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], WorkingShiftsController.prototype, "findByProperty", null);
__decorate([
    (0, common_1.Get)('date-range'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], WorkingShiftsController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkingShiftsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_working_shift_dto_1.UpdateWorkingShiftDto]),
    __metadata("design:returntype", Promise)
], WorkingShiftsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkingShiftsController.prototype, "remove", null);
exports.WorkingShiftsController = WorkingShiftsController = __decorate([
    (0, common_1.Controller)('working-shifts'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [working_shifts_service_1.WorkingShiftsService])
], WorkingShiftsController);
//# sourceMappingURL=working-shifts.controller.js.map