import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Overtime } from '../entities/hr/overtime.entity';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';

@Injectable()
export class OvertimesService {
  constructor(
    @InjectRepository(Overtime)
    private overtimeRepository: Repository<Overtime>
  ) {}

  async create(createOvertimeDto: CreateOvertimeDto): Promise<Overtime> {
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

  async findAll(
    page: number = 1,
    limit: number = 10,
    employeeId?: string,
    workingShiftId?: string,
    approvedBy?: string
  ) {
    const queryBuilder = this.overtimeRepository
      .createQueryBuilder('overtime')
      .leftJoinAndSelect('overtime.employee', 'employee')
      .leftJoinAndSelect('overtime.workingShift', 'workingShift');

    // Apply filters
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

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Add ordering
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

  async findOne(id: string): Promise<Overtime> {
    const overtime = await this.overtimeRepository.findOne({
      where: { id },
      relations: ['employee', 'workingShift']
    });

    if (!overtime) {
      throw new NotFoundException(`Overtime with ID ${id} not found`);
    }

    return overtime;
  }

  async update(
    id: string,
    updateOvertimeDto: UpdateOvertimeDto
  ): Promise<Overtime> {
    const overtime = await this.findOne(id);

    Object.assign(overtime, updateOvertimeDto);
    return await this.overtimeRepository.save(overtime);
  }

  async remove(id: string): Promise<void> {
    const overtime = await this.findOne(id);
    await this.overtimeRepository.remove(overtime);
  }

  // Additional utility methods
  async findByEmployee(
    employeeId: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.findAll(page, limit, employeeId);
  }

  async findByWorkingShift(
    workingShiftId: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.findAll(page, limit, undefined, workingShiftId);
  }

  async findByApprover(
    approvedBy: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.findAll(page, limit, undefined, undefined, approvedBy);
  }

  async getTotalOvertimeByEmployee(employeeId: string) {
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

  async calculateOvertimeAmount(
    numberOfHours: number,
    rate: number
  ): Promise<number> {
    return numberOfHours * rate;
  }
}
