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
exports.LeaveController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const leave_service_1 = require("./leave.service");
const create_leave_dto_1 = require("./dto/create-leave.dto");
let LeaveController = class LeaveController {
    leaveService;
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    async createLeave(createLeaveDto) {
        return this.leaveService.createLeave(createLeaveDto);
    }
    async findAllLeaves(page = 1, limit = 10, employeeId, status, leaveType, startDate, endDate) {
        return this.leaveService.findAllLeaves(page, limit, employeeId, status, leaveType, startDate, endDate);
    }
    async getPendingLeaves() {
        return this.leaveService.getPendingLeaves();
    }
    async getLeaveSummary(startDate, endDate, employeeId) {
        return this.leaveService.getLeaveSummary(startDate, endDate, employeeId);
    }
    async getEmployeeLeaveBalance(employeeId, year) {
        return this.leaveService.getEmployeeLeaveBalance(employeeId, year);
    }
    async findLeaveById(id) {
        return this.leaveService.findLeaveById(id);
    }
    async updateLeave(id, updateLeaveDto) {
        return this.leaveService.updateLeave(id, updateLeaveDto);
    }
    async deleteLeave(id) {
        await this.leaveService.deleteLeave(id);
        return { message: 'Leave request deleted successfully' };
    }
    async approveRejectLeave(id, approveRejectDto, approverId) {
        return this.leaveService.approveRejectLeave(id, approveRejectDto, approverId);
    }
};
exports.LeaveController = LeaveController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_dto_1.CreateLeaveDto]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "createLeave", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('leaveType')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "findAllLeaves", null);
__decorate([
    (0, common_1.Get)('pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getPendingLeaves", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveSummary", null);
__decorate([
    (0, common_1.Get)('balance/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getEmployeeLeaveBalance", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "findLeaveById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_leave_dto_1.UpdateLeaveDto]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "updateLeave", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "deleteLeave", null);
__decorate([
    (0, common_1.Post)(':id/approve-reject'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('approverId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_leave_dto_1.ApproveRejectLeaveDto, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "approveRejectLeave", null);
exports.LeaveController = LeaveController = __decorate([
    (0, common_1.Controller)('leaves'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [leave_service_1.LeaveService])
], LeaveController);
//# sourceMappingURL=leave.controller.js.map