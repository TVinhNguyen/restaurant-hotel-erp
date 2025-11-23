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
    private employeeEvaluationRepository: Repository<EmployeeEvaluation>
  ) {}

  async create(
    createEmployeeEvaluationDto: CreateEmployeeEvaluationDto
  ): Promise<EmployeeEvaluation> {
    // Calculate overall score from category scores
    const overallScore =
      ((createEmployeeEvaluationDto.workQualityScore || 0) +
        (createEmployeeEvaluationDto.productivityScore || 0) +
        (createEmployeeEvaluationDto.communicationScore || 0) +
        (createEmployeeEvaluationDto.teamworkScore || 0) +
        (createEmployeeEvaluationDto.problemSolvingScore || 0) +
        (createEmployeeEvaluationDto.punctualityScore || 0) +
        (createEmployeeEvaluationDto.initiativeScore || 0)) /
      7;

    const evaluation = this.employeeEvaluationRepository.create({
      ...createEmployeeEvaluationDto,
      overallScore: Math.round(overallScore * 100) / 100 // Round to 2 decimal places
    });
    return await this.employeeEvaluationRepository.save(evaluation);
  }

  async getAllEvaluations() {
    const evaluations = await this.employeeEvaluationRepository.find({
      relations: ['employee', 'evaluator', 'evaluatedByEmployee'],
      order: { createdAt: 'DESC' }
    });

    return {
      data: evaluations,
      total: evaluations.length
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    employeeId?: string,
    evaluatorId?: string,
    status?: string,
    evaluationPeriod?: string
  ) {
    const queryBuilder = this.employeeEvaluationRepository
      .createQueryBuilder('evaluation')
      .leftJoinAndSelect('evaluation.employee', 'employee')
      .leftJoinAndSelect('evaluation.evaluator', 'evaluator');

    // Apply filters
    if (employeeId) {
      queryBuilder.andWhere('evaluation.employeeId = :employeeId', {
        employeeId
      });
    }

    if (evaluatorId) {
      queryBuilder.andWhere('evaluation.evaluatorId = :evaluatorId', {
        evaluatorId
      });
    }

    if (status) {
      queryBuilder.andWhere('evaluation.status = :status', { status });
    }

    if (evaluationPeriod) {
      queryBuilder.andWhere('evaluation.evaluationPeriod = :evaluationPeriod', {
        evaluationPeriod
      });
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
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<EmployeeEvaluation> {
    const evaluation = await this.employeeEvaluationRepository.findOne({
      where: { id },
      relations: ['employee', 'evaluator', 'evaluatedByEmployee']
    });

    if (!evaluation) {
      throw new NotFoundException(
        `Employee evaluation with ID ${id} not found`
      );
    }

    return evaluation;
  }

  async update(
    id: string,
    updateEmployeeEvaluationDto: UpdateEmployeeEvaluationDto
  ): Promise<EmployeeEvaluation> {
    const evaluation = await this.findOne(id);

    Object.assign(evaluation, updateEmployeeEvaluationDto);

    // Recalculate overall score if any category scores are updated
    const hasScoreUpdates = [
      'workQualityScore',
      'productivityScore',
      'communicationScore',
      'teamworkScore',
      'problemSolvingScore',
      'punctualityScore',
      'initiativeScore'
    ].some(field => (updateEmployeeEvaluationDto as any)[field] !== undefined);

    if (hasScoreUpdates) {
      const overallScore =
        ((evaluation.workQualityScore || 0) +
          (evaluation.productivityScore || 0) +
          (evaluation.communicationScore || 0) +
          (evaluation.teamworkScore || 0) +
          (evaluation.problemSolvingScore || 0) +
          (evaluation.punctualityScore || 0) +
          (evaluation.initiativeScore || 0)) /
        7;

      evaluation.overallScore = Math.round(overallScore * 100) / 100; // Round to 2 decimal places
    }

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
    limit: number = 10
  ) {
    return this.findAll(page, limit, employeeId);
  }

  async findByEvaluator(
    evaluatorId: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.findAll(page, limit, undefined, evaluatorId);
  }

  async findByStatus(status: string, page: number = 1, limit: number = 10) {
    return this.findAll(page, limit, undefined, undefined, status);
  }

  async findByPeriod(
    evaluationPeriod: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.findAll(
      page,
      limit,
      undefined,
      undefined,
      undefined,
      evaluationPeriod
    );
  }

  async getAverageScoreByEmployee(employeeId: string) {
    const result = await this.employeeEvaluationRepository
      .createQueryBuilder('evaluation')
      .select('AVG(evaluation.overallScore)', 'averageScore')
      .addSelect('COUNT(evaluation.id)', 'totalEvaluations')
      .where('evaluation.employeeId = :employeeId', { employeeId })
      .andWhere('evaluation.overallScore IS NOT NULL')
      .getRawOne();

    return {
      employeeId,
      averageScore: parseFloat(result.averageScore) || 0,
      totalEvaluations: parseInt(result.totalEvaluations) || 0
    };
  }

  async getEvaluationStatsByPeriod(evaluationPeriod: string) {
    const result = await this.employeeEvaluationRepository
      .createQueryBuilder('evaluation')
      .select('AVG(evaluation.overallScore)', 'averageScore')
      .addSelect('COUNT(evaluation.id)', 'totalEvaluations')
      .addSelect('MIN(evaluation.overallScore)', 'minScore')
      .addSelect('MAX(evaluation.overallScore)', 'maxScore')
      .where('evaluation.evaluationPeriod = :evaluationPeriod', {
        evaluationPeriod
      })
      .andWhere('evaluation.overallScore IS NOT NULL')
      .getRawOne();

    return {
      evaluationPeriod,
      averageScore: parseFloat(result.averageScore) || 0,
      totalEvaluations: parseInt(result.totalEvaluations) || 0,
      minScore: parseFloat(result.minScore) || 0,
      maxScore: parseFloat(result.maxScore) || 0
    };
  }

  async acknowledgeEvaluation(
    id: string,
    employeeComments?: string
  ): Promise<EmployeeEvaluation> {
    const evaluation = await this.findOne(id);

    evaluation.employeeAcknowledged = true;
    evaluation.employeeAcknowledgedDate = new Date();
    if (employeeComments) {
      evaluation.employeeComments = employeeComments;
    }

    return await this.employeeEvaluationRepository.save(evaluation);
  }

  async calculateOverallScore(evaluationId: string): Promise<number> {
    const evaluation = await this.findOne(evaluationId);

    const scores = [
      evaluation.workQualityScore,
      evaluation.productivityScore,
      evaluation.communicationScore,
      evaluation.teamworkScore,
      evaluation.problemSolvingScore,
      evaluation.punctualityScore,
      evaluation.initiativeScore
    ].filter(score => score !== null && score !== undefined);

    if (scores.length === 0) return 0;

    const average =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Update the overall score in database
    evaluation.overallScore = Math.round(average * 100) / 100; // Round to 2 decimal places
    await this.employeeEvaluationRepository.save(evaluation);

    return evaluation.overallScore;
  }
}
