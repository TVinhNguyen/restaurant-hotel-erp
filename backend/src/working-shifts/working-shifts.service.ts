import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkingShift } from '../entities/hr/working-shift.entity';
import { CreateWorkingShiftDto } from './dto/create-working-shift.dto';
import { UpdateWorkingShiftDto } from './dto/update-working-shift.dto';

@Injectable()
export class WorkingShiftsService {
  constructor(
    @InjectRepository(WorkingShift)
    private workingShiftRepository: Repository<WorkingShift>,
  ) {}

  async create(
    createWorkingShiftDto: CreateWorkingShiftDto,
  ): Promise<WorkingShift> {
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
      isReassigned: createWorkingShiftDto.isReassigned || false,
    };

    const workingShift = this.workingShiftRepository.create(workingShiftData);
    return await this.workingShiftRepository.save(workingShift);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    employeeId?: string,
    propertyId?: string,
    date?: string,
    shiftType?: string,
  ) {
    const queryBuilder = this.workingShiftRepository
      .createQueryBuilder('workingShift')
      .leftJoinAndSelect('workingShift.employee', 'employee')
      .leftJoinAndSelect('workingShift.property', 'property');

    // Apply filters
    if (employeeId) {
      queryBuilder.andWhere('workingShift.employeeId = :employeeId', {
        employeeId,
      });
    }

    if (propertyId) {
      queryBuilder.andWhere('workingShift.propertyId = :propertyId', {
        propertyId,
      });
    }

    if (date) {
      queryBuilder.andWhere('workingShift.workingDate = :date', { date });
    }

    if (shiftType) {
      queryBuilder.andWhere('workingShift.shiftType = :shiftType', {
        shiftType,
      });
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Add ordering
    queryBuilder.orderBy('workingShift.workingDate', 'DESC');
    queryBuilder.addOrderBy('workingShift.startTime', 'ASC');

    const [workingShifts, total] = await queryBuilder.getManyAndCount();

    return {
      data: workingShifts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<WorkingShift> {
    const workingShift = await this.workingShiftRepository.findOne({
      where: { id },
      relations: ['employee', 'property', 'attendances', 'overtimes'],
    });

    if (!workingShift) {
      throw new NotFoundException(`Working shift with ID ${id} not found`);
    }

    return workingShift;
  }

  async update(
    id: string,
    updateWorkingShiftDto: UpdateWorkingShiftDto,
  ): Promise<WorkingShift> {
    const workingShift = await this.findOne(id);

    const updateData = {
      ...updateWorkingShiftDto,
      workingDate: updateWorkingShiftDto.workingDate
        ? new Date(updateWorkingShiftDto.workingDate)
        : workingShift.workingDate,
    };

    Object.assign(workingShift, updateData);
    return await this.workingShiftRepository.save(workingShift);
  }

  async remove(id: string): Promise<void> {
    const workingShift = await this.findOne(id);
    await this.workingShiftRepository.remove(workingShift);
  }

  // Additional utility methods
  async findByEmployee(
    employeeId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.findAll(page, limit, employeeId);
  }

  async findByProperty(
    propertyId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.findAll(page, limit, undefined, propertyId);
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const queryBuilder = this.workingShiftRepository
      .createQueryBuilder('workingShift')
      .leftJoinAndSelect('workingShift.employee', 'employee')
      .leftJoinAndSelect('workingShift.property', 'property')
      .where('workingShift.workingDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
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
      totalPages: Math.ceil(total / limit),
    };
  }
}
