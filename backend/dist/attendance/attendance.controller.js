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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const attendance_service_1 = require("./attendance.service");
const create_attendance_dto_1 = require("./dto/create-attendance.dto");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async createAttendance(createAttendanceDto) {
        return this.attendanceService.createAttendance(createAttendanceDto);
    }
    async bulkCreateAttendance(bulkAttendanceDto) {
        return this.attendanceService.bulkCreateAttendance(bulkAttendanceDto);
    }
    async findAllAttendance(page = 1, limit = 10, employeeId, date, status, startDate, endDate) {
        return this.attendanceService.findAllAttendance(page, limit, employeeId, date, status, startDate, endDate);
    }
    async getAttendanceSummary(startDate, endDate, employeeId) {
        return this.attendanceService.getAttendanceSummary(startDate, endDate, employeeId);
    }
    async getDailyAttendanceReport(date) {
        return this.attendanceService.getDailyAttendanceReport(date);
    }
    async findAttendanceById(id) {
        return this.attendanceService.findAttendanceById(id);
    }
    async updateAttendance(id, updateAttendanceDto) {
        return this.attendanceService.updateAttendance(id, updateAttendanceDto);
    }
    async deleteAttendance(id) {
        await this.attendanceService.deleteAttendance(id);
        return { message: 'Attendance record deleted successfully' };
    }
    async checkIn(employeeId) {
        return this.attendanceService.checkIn(employeeId);
    }
    async checkOut(employeeId) {
        return this.attendanceService.checkOut(employeeId);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "createAttendance", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_dto_1.BulkAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "bulkCreateAttendance", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, common_1.Query)('date')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findAllAttendance", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceSummary", null);
__decorate([
    (0, common_1.Get)('daily/:date'),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getDailyAttendanceReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findAttendanceById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_attendance_dto_1.UpdateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateAttendance", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "deleteAttendance", null);
__decorate([
    (0, common_1.Post)('check-in/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('check-out/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkOut", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map