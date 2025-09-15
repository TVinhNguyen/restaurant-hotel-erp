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
exports.EmployeeEvaluationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_evaluation_entity_1 = require("../entities/hr/employee-evaluation.entity");
let EmployeeEvaluationsService = class EmployeeEvaluationsService {
    employeeEvaluationRepository;
    constructor(employeeEvaluationRepository) {
        this.employeeEvaluationRepository = employeeEvaluationRepository;
    }
    async create(createEmployeeEvaluationDto) {
        const evaluationData = {
            employeeId: createEmployeeEvaluationDto.employeeId,
            evaluatedBy: createEmployeeEvaluationDto.evaluatedBy,
            rate: createEmployeeEvaluationDto.rate,
            period: createEmployeeEvaluationDto.period,
            goals: createEmployeeEvaluationDto.goals,
            strength: createEmployeeEvaluationDto.strength,
            improvement: createEmployeeEvaluationDto.improvement,
            comments: createEmployeeEvaluationDto.comments
        };
        const evaluation = this.employeeEvaluationRepository.create(evaluationData);
        return await this.employeeEvaluationRepository.save(evaluation);
    }
    async findAll(page = 1, limit = 10, employeeId, evaluatedBy, period, rateMin, rateMax) {
        const queryBuilder = this.employeeEvaluationRepository
            .createQueryBuilder('evaluation')
            .leftJoinAndSelect('evaluation.employee', 'employee');
        if (employeeId) {
            queryBuilder.andWhere('evaluation.employeeId = :employeeId', {
                employeeId
            });
        }
        if (evaluatedBy) {
            queryBuilder.andWhere('evaluation.evaluatedBy = :evaluatedBy', {
                evaluatedBy
            });
        }
        if (period) {
            queryBuilder.andWhere('evaluation.period = :period', { period });
        }
        if (rateMin !== undefined) {
            queryBuilder.andWhere('evaluation.rate >= :rateMin', { rateMin });
        }
        if (rateMax !== undefined) {
            queryBuilder.andWhere('evaluation.rate <= :rateMax', { rateMax });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('evaluation.createdAt', 'DESC');
        const [evaluations, total] = await queryBuilder.getManyAndCount();
        return {
            data: evaluations,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findOne(id) {
        const evaluation = await this.employeeEvaluationRepository.findOne({
            where: { id },
            relations: ['employee']
        });
        if (!evaluation) {
            throw new common_1.NotFoundException(`Employee evaluation with ID ${id} not found`);
        }
        return evaluation;
    }
    async update(id, updateEmployeeEvaluationDto) {
        const evaluation = await this.findOne(id);
        Object.assign(evaluation, updateEmployeeEvaluationDto);
        return await this.employeeEvaluationRepository.save(evaluation);
    }
    async remove(id) {
        const evaluation = await this.findOne(id);
        await this.employeeEvaluationRepository.remove(evaluation);
    }
    async findByEmployee(employeeId, page = 1, limit = 10) {
        return this.findAll(page, limit, employeeId);
    }
    async findByEvaluator(evaluatedBy, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, evaluatedBy);
    }
    async findByPeriod(period, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, undefined, period);
    }
    async findByRateRange(rateMin, rateMax, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, undefined, undefined, rateMin, rateMax);
    }
    async getAverageRateByEmployee(employeeId) {
        const result = await this.employeeEvaluationRepository
            .createQueryBuilder('evaluation')
            .select('AVG(evaluation.rate)', 'averageRate')
            .addSelect('COUNT(evaluation.id)', 'totalEvaluations')
            .where('evaluation.employeeId = :employeeId', { employeeId })
            .andWhere('evaluation.rate IS NOT NULL')
            .getRawOne();
        return {
            employeeId,
            averageRate: parseFloat(result.averageRate) || 0,
            totalEvaluations: parseInt(result.totalEvaluations) || 0
        };
    }
    async getEvaluationStatsByPeriod(period) {
        const result = await this.employeeEvaluationRepository
            .createQueryBuilder('evaluation')
            .select('AVG(evaluation.rate)', 'averageRate')
            .addSelect('COUNT(evaluation.id)', 'totalEvaluations')
            .addSelect('MIN(evaluation.rate)', 'minRate')
            .addSelect('MAX(evaluation.rate)', 'maxRate')
            .where('evaluation.period = :period', { period })
            .andWhere('evaluation.rate IS NOT NULL')
            .getRawOne();
        return {
            period,
            averageRate: parseFloat(result.averageRate) || 0,
            totalEvaluations: parseInt(result.totalEvaluations) || 0,
            minRate: parseInt(result.minRate) || 0,
            maxRate: parseInt(result.maxRate) || 0
        };
    }
};
exports.EmployeeEvaluationsService = EmployeeEvaluationsService;
exports.EmployeeEvaluationsService = EmployeeEvaluationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_evaluation_entity_1.EmployeeEvaluation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeeEvaluationsService);
//# sourceMappingURL=employee-evaluations.service.js.map