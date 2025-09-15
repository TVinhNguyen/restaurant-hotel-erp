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
exports.WorkingShiftsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const working_shift_entity_1 = require("../entities/hr/working-shift.entity");
let WorkingShiftsService = class WorkingShiftsService {
    workingShiftRepository;
    constructor(workingShiftRepository) {
        this.workingShiftRepository = workingShiftRepository;
    }
    async create(createWorkingShiftDto) {
        const workingShiftData = {
            propertyId: createWorkingShiftDto.propertyId,
            employeeId: createWorkingShiftDto.employeeId,
            workingDate: createWorkingShiftDto.workingDate
                ? new Date(createWorkingShiftDto.workingDate)
                : undefined,
            startTime: createWorkingShiftDto.startTime,
            endTime: createWorkingShiftDto.endTime,
            shiftType: createWorkingShiftDto.shiftType,
            notes: createWorkingShiftDto.notes,
            isReassigned: createWorkingShiftDto.isReassigned || false
        };
        const workingShift = this.workingShiftRepository.create(workingShiftData);
        return await this.workingShiftRepository.save(workingShift);
    }
    async findAll(page = 1, limit = 10, employeeId, propertyId, date, shiftType) {
        const queryBuilder = this.workingShiftRepository
            .createQueryBuilder('workingShift')
            .leftJoinAndSelect('workingShift.employee', 'employee')
            .leftJoinAndSelect('workingShift.property', 'property');
        if (employeeId) {
            queryBuilder.andWhere('workingShift.employeeId = :employeeId', {
                employeeId
            });
        }
        if (propertyId) {
            queryBuilder.andWhere('workingShift.propertyId = :propertyId', {
                propertyId
            });
        }
        if (date) {
            queryBuilder.andWhere('workingShift.workingDate = :date', { date });
        }
        if (shiftType) {
            queryBuilder.andWhere('workingShift.shiftType = :shiftType', {
                shiftType
            });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('workingShift.workingDate', 'DESC');
        queryBuilder.addOrderBy('workingShift.startTime', 'ASC');
        const [workingShifts, total] = await queryBuilder.getManyAndCount();
        return {
            data: workingShifts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findOne(id) {
        const workingShift = await this.workingShiftRepository.findOne({
            where: { id },
            relations: ['employee', 'property', 'attendances', 'overtimes']
        });
        if (!workingShift) {
            throw new common_1.NotFoundException(`Working shift with ID ${id} not found`);
        }
        return workingShift;
    }
    async update(id, updateWorkingShiftDto) {
        const workingShift = await this.findOne(id);
        const updateData = {
            ...updateWorkingShiftDto,
            workingDate: updateWorkingShiftDto.workingDate
                ? new Date(updateWorkingShiftDto.workingDate)
                : workingShift.workingDate
        };
        Object.assign(workingShift, updateData);
        return await this.workingShiftRepository.save(workingShift);
    }
    async remove(id) {
        const workingShift = await this.findOne(id);
        await this.workingShiftRepository.remove(workingShift);
    }
    async findByEmployee(employeeId, page = 1, limit = 10) {
        return this.findAll(page, limit, employeeId);
    }
    async findByProperty(propertyId, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, propertyId);
    }
    async findByDateRange(startDate, endDate, page = 1, limit = 10) {
        const queryBuilder = this.workingShiftRepository
            .createQueryBuilder('workingShift')
            .leftJoinAndSelect('workingShift.employee', 'employee')
            .leftJoinAndSelect('workingShift.property', 'property')
            .where('workingShift.workingDate BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        })
            .orderBy('workingShift.workingDate', 'DESC')
            .addOrderBy('workingShift.startTime', 'ASC');
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [workingShifts, total] = await queryBuilder.getManyAndCount();
        return {
            data: workingShifts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
};
exports.WorkingShiftsService = WorkingShiftsService;
exports.WorkingShiftsService = WorkingShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(working_shift_entity_1.WorkingShift)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorkingShiftsService);
//# sourceMappingURL=working-shifts.service.js.map