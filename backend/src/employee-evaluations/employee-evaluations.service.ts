import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEvaluation } from '../entities/hr/employee-evaluation.entity';
import { CreateEmployeeEvaluationDto } from './dto/create-employee-evaluation.dto';
import { UpdateEmployeeEvaluationDto } from './dto/update-employee-evaluation.dto';

@Injectable()
export class EmployeeEvaluationsService {
  constructor(
    @InjectRepository(EmployeeEvaluation)
    private employeeEvaluationRepository: Repository<EmployeeEvaluation>,
  ) {}

  async create(
    createEmployeeEvaluationDto: CreateEmployeeEvaluationDto,
  ): Promise<EmployeeEvaluation> {
    const evaluationData = {
      employeeId: createEmployeeEvaluationDto.employeeId,
      evaluatedBy: createEmployeeEvaluationDto.evaluatedBy,
      rate: createEmployeeEvaluationDto.rate,
      period: createEmployeeEvaluationDto.period,
      goals: createEmployeeEvaluationDto.goals,
      strength: createEmployeeEvaluationDto.strength,
      improvement: createEmployeeEvaluationDto.improvement,
      comments: createEmployeeEvaluationDto.comments,
    };

    const evaluation = this.employeeEvaluationRepository.create(evaluationData);
    return await this.employeeEvaluationRepository.save(evaluation);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    employeeId?: string,
    evaluatedBy?: string,
    period?: string,
    rateMin?: number,
    rateMax?: number,
  ) {
    const queryBuilder = this.employeeEvaluationRepository
      .createQueryBuilder('evaluation')
      .leftJoinAndSelect('evaluation.employee', 'employee');

    // Apply filters
    if (employeeId) {
      queryBuilder.andWhere('evaluation.employeeId = :employeeId', {
        employeeId,
      });
    }

    if (evaluatedBy) {
      queryBuilder.andWhere('evaluation.evaluatedBy = :evaluatedBy', {
        evaluatedBy,
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

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Add ordering
    queryBuilder.orderBy('evaluation.createdAt', 'DESC');

    const [evaluations, total] = await queryBuilder.getManyAndCount();

    return {
      data: evaluations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<EmployeeEvaluation> {
    const evaluation = await this.employeeEvaluationRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!evaluation) {
      throw new NotFoundException(
        `Employee evaluation with ID ${id} not found`,
      );
    }

    return evaluation;
  }

  async update(
    id: string,
    updateEmployeeEvaluationDto: UpdateEmployeeEvaluationDto,
  ): Promise<EmployeeEvaluation> {
    const evaluation = await this.findOne(id);

    Object.assign(evaluation, updateEmployeeEvaluationDto);
    return await this.employeeEvaluationRepository.save(evaluation);
  }

  async remove(id: string): Promise<void> {
    const evaluation = await this.findOne(id);
    await this.employeeEvaluationRepository.remove(evaluation);
  }

  // Additional utility methods
  async findByEmployee(
    employeeId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.findAll(page, limit, employeeId);
  }

  async findByEvaluator(
    evaluatedBy: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.findAll(page, limit, undefined, evaluatedBy);
  }

  async findByPeriod(period: string, page: number = 1, limit: number = 10) {
    return this.findAll(page, limit, undefined, undefined, period);
  }

  async findByRateRange(
    rateMin: number,
    rateMax: number,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.findAll(
      page,
      limit,
      undefined,
      undefined,
      undefined,
      rateMin,
      rateMax,
    );
  }

  async getAverageRateByEmployee(employeeId: string) {
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
      totalEvaluations: parseInt(result.totalEvaluations) || 0,
    };
  }

  async getEvaluationStatsByPeriod(period: string) {
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
      maxRate: parseInt(result.maxRate) || 0,
    };
  }
}
