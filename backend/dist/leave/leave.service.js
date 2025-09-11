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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_entity_1 = require("../entities/hr/leave.entity");
const employee_entity_1 = require("../entities/core/employee.entity");
const create_leave_dto_1 = require("./dto/create-leave.dto");
let LeaveService = class LeaveService {
    leaveRepository;
    employeeRepository;
    constructor(leaveRepository, employeeRepository) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }
    async createLeave(createLeaveDto) {
        const employee = await this.employeeRepository.findOne({
            where: { id: createLeaveDto.employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${createLeaveDto.employeeId} not found`);
        }
        const leave = this.leaveRepository.create({
            ...createLeaveDto,
            numberOfDays: createLeaveDto.numberOfDays || 1,
            status: createLeaveDto.status || create_leave_dto_1.LeaveStatus.PENDING,
        });
        return await this.leaveRepository.save(leave);
    }
    async findAllLeaves(page = 1, limit = 10, employeeId, status, leaveType, startDate, endDate) {
        const queryBuilder = this.leaveRepository
            .createQueryBuilder('leave')
            .leftJoinAndSelect('leave.employee', 'employee')
            .leftJoinAndSelect('leave.approver', 'approver');
        if (employeeId) {
            queryBuilder.andWhere('leave.employeeId = :employeeId', { employeeId });
        }
        if (status) {
            queryBuilder.andWhere('leave.status = :status', { status });
        }
        if (leaveType) {
            queryBuilder.andWhere('leave.leaveType = :leaveType', { leaveType });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere('leave.leaveDate BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const [leaves, total] = await queryBuilder
            .orderBy('leave.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: leaves,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findLeaveById(id) {
        const leave = await this.leaveRepository.findOne({
            where: { id },
            relations: ['employee', 'approver'],
        });
        if (!leave) {
            throw new common_1.NotFoundException(`Leave with ID ${id} not found`);
        }
        return leave;
    }
    async updateLeave(id, updateLeaveDto) {
        const leave = await this.findLeaveById(id);
        if (leave.status === create_leave_dto_1.LeaveStatus.APPROVED || leave.status === create_leave_dto_1.LeaveStatus.REJECTED) {
            throw new common_1.BadRequestException(`Cannot update leave with status: ${leave.status}`);
        }
        await this.leaveRepository.update(id, updateLeaveDto);
        return this.findLeaveById(id);
    }
    async deleteLeave(id) {
        const leave = await this.findLeaveById(id);
        if (leave.status === create_leave_dto_1.LeaveStatus.APPROVED) {
            throw new common_1.BadRequestException('Cannot delete approved leave');
        }
        await this.leaveRepository.remove(leave);
    }
    async approveRejectLeave(id, approveRejectDto, approverId) {
        const leave = await this.findLeaveById(id);
        if (leave.status !== create_leave_dto_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException(`Cannot review leave with status: ${leave.status}`);
        }
        await this.leaveRepository.update(id, {
            status: approveRejectDto.status,
            hrNote: approveRejectDto.hrNote,
            approvedBy: approverId,
        });
        return this.findLeaveById(id);
    }
    async getLeaveSummary(startDate, endDate, employeeId) {
        const queryBuilder = this.leaveRepository
            .createQueryBuilder('leave')
            .leftJoin('leave.employee', 'employee')
            .where('leave.leaveDate BETWEEN :startDate AND :endDate', { startDate, endDate });
        if (employeeId) {
            queryBuilder.andWhere('leave.employeeId = :employeeId', { employeeId });
        }
        const leaves = await queryBuilder.getMany();
        const statusBreakdown = {};
        const typeBreakdown = {};
        leaves.forEach(leave => {
            statusBreakdown[leave.status] = (statusBreakdown[leave.status] || 0) + 1;
            typeBreakdown[leave.leaveType] = (typeBreakdown[leave.leaveType] || 0) + 1;
        });
        return {
            period: { startDate, endDate },
            totalRequests: leaves.length,
            statusBreakdown,
            typeBreakdown,
            totalDaysRequested: leaves.reduce((sum, leave) => sum + leave.numberOfDays, 0),
            approvedDays: leaves
                .filter(leave => leave.status === create_leave_dto_1.LeaveStatus.APPROVED)
                .reduce((sum, leave) => sum + leave.numberOfDays, 0),
        };
    }
    async getPendingLeaves() {
        return await this.leaveRepository.find({
            where: { status: create_leave_dto_1.LeaveStatus.PENDING },
            relations: ['employee'],
            order: { createdAt: 'ASC' },
        });
    }
    async getEmployeeLeaveBalance(employeeId, year) {
        const currentYear = year || new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
        const leaves = await this.leaveRepository.find({
            where: {
                employeeId,
                status: create_leave_dto_1.LeaveStatus.APPROVED,
                leaveDate: (0, typeorm_2.Between)(new Date(startDate), new Date(endDate)),
            },
        });
        const leaveByType = {};
        leaves.forEach(leave => {
            leaveByType[leave.leaveType] = (leaveByType[leave.leaveType] || 0) + leave.numberOfDays;
        });
        const entitlements = {
            [create_leave_dto_1.LeaveType.ANNUAL]: 20,
            [create_leave_dto_1.LeaveType.SICK]: 10,
        };
        const balance = {};
        Object.keys(entitlements).forEach(type => {
            const used = leaveByType[type] || 0;
            const entitled = entitlements[type];
            balance[type] = {
                entitled,
                used,
                remaining: entitled - used,
            };
        });
        return {
            employeeId,
            year: currentYear,
            balance,
            totalLeavesTaken: Object.values(leaveByType).reduce((sum, days) => sum + days, 0),
        };
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_entity_1.Leave)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LeaveService);
//# sourceMappingURL=leave.service.js.map