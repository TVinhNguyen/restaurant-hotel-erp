import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Leave } from '../entities/hr/leave.entity';
import { Employee } from '../entities/core/employee.entity';
import {
  CreateLeaveDto,
  UpdateLeaveDto,
  ApproveRejectLeaveDto,
  LeaveType,
  LeaveStatus,
} from './dto/create-leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async createLeave(createLeaveDto: CreateLeaveDto): Promise<Leave> {
    // Check if employee exists
    const employee = await this.employeeRepository.findOne({
      where: { id: createLeaveDto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createLeaveDto.employeeId} not found`,
      );
    }

    const leave = this.leaveRepository.create({
      ...createLeaveDto,
      numberOfDays: createLeaveDto.numberOfDays || 1,
      status: createLeaveDto.status || LeaveStatus.PENDING,
      appliedDate: createLeaveDto.appliedDate
        ? new Date(createLeaveDto.appliedDate)
        : new Date(),
      startDate: new Date(createLeaveDto.startDate),
      endDate: new Date(createLeaveDto.endDate),
      leaveDate: new Date(createLeaveDto.leaveDate),
    });

    return await this.leaveRepository.save(leave);
  }

  async findAllLeaves(
    page: number = 1,
    limit: number = 10,
    employeeId?: string,
    status?: LeaveStatus,
    leaveType?: LeaveType,
    startDate?: string,
    endDate?: string,
  ) {
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

  async findLeaveById(id: string): Promise<Leave> {
    const leave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['employee', 'approver'],
    });

    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return leave;
  }

  async getLeavesByEmployeeId(employeeId: string, period?: string) {
    const queryBuilder = this.leaveRepository
      .createQueryBuilder('leave')
      .leftJoinAndSelect('leave.employee', 'employee')
      .leftJoinAndSelect('leave.approver', 'approver')
      .where('leave.employeeId = :employeeId', { employeeId });

    if (period) {
      // Period format: YYYY-MM
      const [year, month] = period.split('-');
      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      const endDate = `${year}-${month}-${lastDay}`;
      queryBuilder.andWhere('leave.startDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    }

    const leaves = await queryBuilder
      .orderBy('leave.startDate', 'DESC')
      .getMany();

    return {
      data: leaves,
      total: leaves.length
    };
  }

  async updateLeave(
    id: string,
    updateLeaveDto: UpdateLeaveDto,
  ): Promise<Leave> {
    const leave = await this.findLeaveById(id);

    if (
      leave.status === LeaveStatus.APPROVED ||
      leave.status === LeaveStatus.REJECTED
    ) {
      throw new BadRequestException(
        `Cannot update leave with status: ${leave.status}`,
      );
    }

    await this.leaveRepository.update(id, updateLeaveDto);
    return this.findLeaveById(id);
  }

  async deleteLeave(id: string): Promise<void> {
    const leave = await this.findLeaveById(id);

    if (leave.status === LeaveStatus.APPROVED) {
      throw new BadRequestException('Cannot delete approved leave');
    }

    await this.leaveRepository.remove(leave);
  }

  async approveRejectLeave(
    id: string,
    approveRejectDto: ApproveRejectLeaveDto,
    approverId: string,
  ): Promise<Leave> {
    const leave = await this.findLeaveById(id);

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException(
        `Cannot review leave with status: ${leave.status}`,
      );
    }

    await this.leaveRepository.update(id, {
      status: approveRejectDto.status,
      hrNote: approveRejectDto.hrNote,
      approvedBy: approverId,
    });

    return this.findLeaveById(id);
  }

  async getLeaveSummary(
    startDate: string,
    endDate: string,
    employeeId?: string,
  ) {
    const queryBuilder = this.leaveRepository
      .createQueryBuilder('leave')
      .leftJoin('leave.employee', 'employee')
      .where('leave.leaveDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (employeeId) {
      queryBuilder.andWhere('leave.employeeId = :employeeId', { employeeId });
    }

    const leaves = await queryBuilder.getMany();

    const statusBreakdown: { [key: string]: number } = {};
    const typeBreakdown: { [key: string]: number } = {};

    leaves.forEach((leave) => {
      statusBreakdown[leave.status] = (statusBreakdown[leave.status] || 0) + 1;
      typeBreakdown[leave.leaveType] =
        (typeBreakdown[leave.leaveType] || 0) + 1;
    });

    return {
      period: { startDate, endDate },
      totalRequests: leaves.length,
      statusBreakdown,
      typeBreakdown,
      totalDaysRequested: leaves.reduce(
        (sum, leave) => sum + leave.numberOfDays,
        0,
      ),
      approvedDays: leaves
        .filter((leave) => leave.status === LeaveStatus.APPROVED)
        .reduce((sum, leave) => sum + leave.numberOfDays, 0),
    };
  }

  async getAllLeaves() {
    const leaves = await this.leaveRepository.find({
      relations: ['employee', 'approver'],
      order: { createdAt: 'DESC' }
    });

    return {
      data: leaves,
      total: leaves.length
    };
  }

  async getPendingLeaves(): Promise<Leave[]> {
    return await this.leaveRepository.find({
      where: { status: LeaveStatus.PENDING },
      relations: ['employee'],
      order: { createdAt: 'ASC' },
    });
  }

  async getEmployeeLeaveBalance(
    employeeId: string,
    year?: number,
  ): Promise<any> {
    const currentYear = year || new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;

    const leaves = await this.leaveRepository.find({
      where: {
        employeeId,
        status: LeaveStatus.APPROVED,
        leaveDate: Between(new Date(startDate), new Date(endDate)),
      },
    });

    const leaveByType: { [key: string]: number } = {};
    leaves.forEach((leave) => {
      leaveByType[leave.leaveType] =
        (leaveByType[leave.leaveType] || 0) + leave.numberOfDays;
    });

    // Standard entitlements (can be made configurable)
    const entitlements: { [key: string]: number } = {
      [LeaveType.ANNUAL]: 20, // 20 days annual leave
      [LeaveType.SICK]: 10, // 10 days sick leave
    };

    const balance: { [key: string]: any } = {};
    Object.keys(entitlements).forEach((type) => {
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
      totalLeavesTaken: Object.values(leaveByType).reduce(
        (sum: number, days: number) => sum + days,
        0,
      ),
    };
  }
}
