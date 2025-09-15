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
exports.DeductionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deduction_entity_1 = require("../entities/hr/deduction.entity");
let DeductionsService = class DeductionsService {
    deductionRepository;
    constructor(deductionRepository) {
        this.deductionRepository = deductionRepository;
    }
    async create(createDeductionDto) {
        const deductionData = {
            employeeId: createDeductionDto.employeeId,
            leaveId: createDeductionDto.leaveId,
            type: createDeductionDto.type,
            amount: createDeductionDto.amount,
            date: createDeductionDto.date
                ? new Date(createDeductionDto.date)
                : undefined,
            reasonDetails: createDeductionDto.reasonDetails
        };
        const deduction = this.deductionRepository.create(deductionData);
        return await this.deductionRepository.save(deduction);
    }
    async findAll(page = 1, limit = 10, employeeId, type, startDate, endDate) {
        const queryBuilder = this.deductionRepository
            .createQueryBuilder('deduction')
            .leftJoinAndSelect('deduction.employee', 'employee')
            .leftJoinAndSelect('deduction.leave', 'leave');
        if (employeeId) {
            queryBuilder.andWhere('deduction.employeeId = :employeeId', {
                employeeId
            });
        }
        if (type) {
            queryBuilder.andWhere('deduction.type = :type', { type });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere('deduction.date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('deduction.date', 'DESC');
        queryBuilder.addOrderBy('deduction.createdAt', 'DESC');
        const [deductions, total] = await queryBuilder.getManyAndCount();
        return {
            data: deductions,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findOne(id) {
        const deduction = await this.deductionRepository.findOne({
            where: { id },
            relations: ['employee', 'leave']
        });
        if (!deduction) {
            throw new common_1.NotFoundException(`Deduction with ID ${id} not found`);
        }
        return deduction;
    }
    async update(id, updateDeductionDto) {
        const deduction = await this.findOne(id);
        const updateData = {
            ...updateDeductionDto,
            date: updateDeductionDto.date
                ? new Date(updateDeductionDto.date)
                : deduction.date
        };
        Object.assign(deduction, updateData);
        return await this.deductionRepository.save(deduction);
    }
    async remove(id) {
        const deduction = await this.findOne(id);
        await this.deductionRepository.remove(deduction);
    }
    async findByEmployee(employeeId, page = 1, limit = 10) {
        return this.findAll(page, limit, employeeId);
    }
    async findByType(type, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, type);
    }
    async findByDateRange(startDate, endDate, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, undefined, startDate, endDate);
    }
    async getTotalDeductionsByEmployee(employeeId, startDate, endDate) {
        const queryBuilder = this.deductionRepository
            .createQueryBuilder('deduction')
            .select('SUM(deduction.amount)', 'total')
            .where('deduction.employeeId = :employeeId', { employeeId });
        if (startDate && endDate) {
            queryBuilder.andWhere('deduction.date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            });
        }
        const result = await queryBuilder.getRawOne();
        return {
            employeeId,
            totalDeductions: parseFloat(result.total) || 0,
            period: startDate && endDate ? { startDate, endDate } : 'all-time'
        };
    }
};
exports.DeductionsService = DeductionsService;
exports.DeductionsService = DeductionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deduction_entity_1.Deduction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeductionsService);
//# sourceMappingURL=deductions.service.js.map