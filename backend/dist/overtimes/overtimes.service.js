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
exports.OvertimesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const overtime_entity_1 = require("../entities/hr/overtime.entity");
let OvertimesService = class OvertimesService {
    overtimeRepository;
    constructor(overtimeRepository) {
        this.overtimeRepository = overtimeRepository;
    }
    async create(createOvertimeDto) {
        const overtimeData = {
            employeeId: createOvertimeDto.employeeId,
            workingShiftId: createOvertimeDto.workingShiftId,
            numberOfHours: createOvertimeDto.numberOfHours,
            rate: createOvertimeDto.rate,
            amount: createOvertimeDto.amount,
            approvedBy: createOvertimeDto.approvedBy
        };
        const overtime = this.overtimeRepository.create(overtimeData);
        return await this.overtimeRepository.save(overtime);
    }
    async findAll(page = 1, limit = 10, employeeId, workingShiftId, approvedBy) {
        const queryBuilder = this.overtimeRepository
            .createQueryBuilder('overtime')
            .leftJoinAndSelect('overtime.employee', 'employee')
            .leftJoinAndSelect('overtime.workingShift', 'workingShift');
        if (employeeId) {
            queryBuilder.andWhere('overtime.employeeId = :employeeId', {
                employeeId
            });
        }
        if (workingShiftId) {
            queryBuilder.andWhere('overtime.workingShiftId = :workingShiftId', {
                workingShiftId
            });
        }
        if (approvedBy) {
            queryBuilder.andWhere('overtime.approvedBy = :approvedBy', {
                approvedBy
            });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('overtime.createdAt', 'DESC');
        const [overtimes, total] = await queryBuilder.getManyAndCount();
        return {
            data: overtimes,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findOne(id) {
        const overtime = await this.overtimeRepository.findOne({
            where: { id },
            relations: ['employee', 'workingShift']
        });
        if (!overtime) {
            throw new common_1.NotFoundException(`Overtime with ID ${id} not found`);
        }
        return overtime;
    }
    async update(id, updateOvertimeDto) {
        const overtime = await this.findOne(id);
        Object.assign(overtime, updateOvertimeDto);
        return await this.overtimeRepository.save(overtime);
    }
    async remove(id) {
        const overtime = await this.findOne(id);
        await this.overtimeRepository.remove(overtime);
    }
    async findByEmployee(employeeId, page = 1, limit = 10) {
        return this.findAll(page, limit, employeeId);
    }
    async findByWorkingShift(workingShiftId, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, workingShiftId);
    }
    async findByApprover(approvedBy, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, undefined, approvedBy);
    }
    async getTotalOvertimeByEmployee(employeeId) {
        const result = await this.overtimeRepository
            .createQueryBuilder('overtime')
            .select('SUM(overtime.amount)', 'totalAmount')
            .addSelect('SUM(overtime.numberOfHours)', 'totalHours')
            .where('overtime.employeeId = :employeeId', { employeeId })
            .getRawOne();
        return {
            employeeId,
            totalAmount: parseFloat(result.totalAmount) || 0,
            totalHours: parseFloat(result.totalHours) || 0
        };
    }
    async calculateOvertimeAmount(numberOfHours, rate) {
        return numberOfHours * rate;
    }
};
exports.OvertimesService = OvertimesService;
exports.OvertimesService = OvertimesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(overtime_entity_1.Overtime)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OvertimesService);
//# sourceMappingURL=overtimes.service.js.map