import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deduction } from '../entities/hr/deduction.entity';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';

@Injectable()
export class DeductionsService {
  constructor(
    @InjectRepository(Deduction)
    private deductionRepository: Repository<Deduction>,
  ) {}

  async create(createDeductionDto: CreateDeductionDto): Promise<Deduction> {
    const deductionData = {
      employeeId: createDeductionDto.employeeId,
      leaveId: createDeductionDto.leaveId,
      type: createDeductionDto.type,
      amount: createDeductionDto.amount,
      date: createDeductionDto.date
        ? new Date(createDeductionDto.date)
        : undefined,
      reasonDetails: createDeductionDto.reasonDetails,
    };

    const deduction = this.deductionRepository.create(deductionData);
    return await this.deductionRepository.save(deduction);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    employeeId?: string,
    type?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.deductionRepository
      .createQueryBuilder('deduction')
      .leftJoinAndSelect('deduction.employee', 'employee')
      .leftJoinAndSelect('deduction.leave', 'leave');

    // Apply filters
    if (employeeId) {
      queryBuilder.andWhere('deduction.employeeId = :employeeId', {
        employeeId,
      });
    }

    if (type) {
      queryBuilder.andWhere('deduction.type = :type', { type });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('deduction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Add ordering
    queryBuilder.orderBy('deduction.date', 'DESC');
    queryBuilder.addOrderBy('deduction.createdAt', 'DESC');

    const [deductions, total] = await queryBuilder.getManyAndCount();

    return {
      data: deductions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Deduction> {
    const deduction = await this.deductionRepository.findOne({
      where: { id },
      relations: ['employee', 'leave'],
    });

    if (!deduction) {
      throw new NotFoundException(`Deduction with ID ${id} not found`);
    }

    return deduction;
  }

  async update(
    id: string,
    updateDeductionDto: UpdateDeductionDto,
  ): Promise<Deduction> {
    const deduction = await this.findOne(id);

    const updateData = {
      ...updateDeductionDto,
      date: updateDeductionDto.date
        ? new Date(updateDeductionDto.date)
        : deduction.date,
    };

    Object.assign(deduction, updateData);
    return await this.deductionRepository.save(deduction);
  }

  async remove(id: string): Promise<void> {
    const deduction = await this.findOne(id);
    await this.deductionRepository.remove(deduction);
  }

  // Additional utility methods
  async findByEmployee(
    employeeId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.findAll(page, limit, employeeId);
  }

  async findByType(type: string, page: number = 1, limit: number = 10) {
    return this.findAll(page, limit, undefined, type);
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.findAll(page, limit, undefined, undefined, startDate, endDate);
  }

  async getTotalDeductionsByEmployee(
    employeeId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.deductionRepository
      .createQueryBuilder('deduction')
      .select('SUM(deduction.amount)', 'total')
      .where('deduction.employeeId = :employeeId', { employeeId });

    if (startDate && endDate) {
      queryBuilder.andWhere('deduction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const result = await queryBuilder.getRawOne();
    return {
      employeeId,
      totalDeductions: parseFloat(result.total) || 0,
      period: startDate && endDate ? { startDate, endDate } : 'all-time',
    };
  }
}
