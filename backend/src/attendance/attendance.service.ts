import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from '../entities/hr/attendance.entity';
import { Employee } from '../entities/core/employee.entity';
import { CreateAttendanceDto, UpdateAttendanceDto, BulkAttendanceDto, AttendanceStatus } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async createAttendance(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // Check if employee exists
    const employee = await this.employeeRepository.findOne({
      where: { id: createAttendanceDto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${createAttendanceDto.employeeId} not found`);
    }

    const attendance = this.attendanceRepository.create({
      employeeId: createAttendanceDto.employeeId,
      workingShiftId: createAttendanceDto.workingShiftId,
      checkInTime: createAttendanceDto.checkInTime ? new Date(createAttendanceDto.checkInTime) : null,
      checkOutTime: createAttendanceDto.checkOutTime ? new Date(createAttendanceDto.checkOutTime) : null,
      notes: createAttendanceDto.notes,
    });

    return await this.attendanceRepository.save(attendance);
  }

  async findAllAttendance(
    page: number = 1,
    limit: number = 10,
    employeeId?: string,
    date?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .leftJoinAndSelect('attendance.workingShift', 'workingShift');

    if (employeeId) {
      queryBuilder.andWhere('attendance.employeeId = :employeeId', { employeeId });
    }

    if (date) {
      queryBuilder.andWhere('DATE(attendance.checkInTime) = :date', { date });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('DATE(attendance.checkInTime) BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const [attendance, total] = await queryBuilder
      .orderBy('attendance.checkInTime', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: attendance,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAttendanceById(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['employee', 'workingShift'],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async updateAttendance(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    await this.findAttendanceById(id);
    
    const updateData: any = {};
    if (updateAttendanceDto.workingShiftId !== undefined) updateData.workingShiftId = updateAttendanceDto.workingShiftId;
    if (updateAttendanceDto.checkInTime !== undefined) updateData.checkInTime = new Date(updateAttendanceDto.checkInTime);
    if (updateAttendanceDto.checkOutTime !== undefined) updateData.checkOutTime = new Date(updateAttendanceDto.checkOutTime);
    if (updateAttendanceDto.notes !== undefined) updateData.notes = updateAttendanceDto.notes;

    await this.attendanceRepository.update(id, updateData);
    return this.findAttendanceById(id);
  }

  async deleteAttendance(id: string): Promise<void> {
    const attendance = await this.findAttendanceById(id);
    await this.attendanceRepository.remove(attendance);
  }

  async checkIn(employeeId: string): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if already checked in today
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        checkInTime: Between(today, tomorrow),
      },
    });

    if (existingAttendance) {
      throw new BadRequestException('Already checked in today');
    }

    const attendance = this.attendanceRepository.create({
      employeeId,
      checkInTime: new Date(),
    });

    return await this.attendanceRepository.save(attendance);
  }

  async checkOut(employeeId: string): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        checkInTime: Between(today, tomorrow),
      },
    });

    if (!attendance) {
      throw new NotFoundException('No check-in record found for today');
    }

    if (attendance.checkOutTime) {
      throw new BadRequestException('Already checked out today');
    }

    await this.attendanceRepository.update(attendance.id, {
      checkOutTime: new Date(),
    });

    return this.findAttendanceById(attendance.id);
  }

  async bulkCreateAttendance(bulkAttendanceDto: BulkAttendanceDto): Promise<Attendance[]> {
    const { date, attendances } = bulkAttendanceDto;
    
    // Convert date to date range for checking existing records
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    
    // Check for existing attendance records
    const existingAttendances = await this.attendanceRepository.find({
      where: { 
        checkInTime: Between(startDate, endDate)
      },
    });

    const existingEmployeeIds = existingAttendances.map(att => att.employeeId);

    // Filter out employees who already have attendance for this date
    const newAttendances = attendances.filter(
      att => !existingEmployeeIds.includes(att.employeeId)
    );

    if (newAttendances.length === 0) {
      throw new BadRequestException('All employees already have attendance records for this date');
    }

    const attendanceEntities = newAttendances.map(att =>
      this.attendanceRepository.create({
        employeeId: att.employeeId,
        checkInTime: att.checkInTime ? new Date(att.checkInTime) : null,
        checkOutTime: att.checkOutTime ? new Date(att.checkOutTime) : null,
        notes: att.notes,
      })
    );

    return await this.attendanceRepository.save(attendanceEntities);
  }

  async getAttendanceSummary(
    startDate: string,
    endDate: string,
    employeeId?: string,
  ) {
    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoin('attendance.employee', 'employee')
      .where('attendance.checkInTime BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (employeeId) {
      queryBuilder.andWhere('attendance.employeeId = :employeeId', { employeeId });
    }

    const attendanceRecords = await queryBuilder.getMany();

    // Group by employee
    const employeeAttendance: { [key: string]: any } = {};
    
    attendanceRecords.forEach(record => {
      if (!employeeAttendance[record.employeeId]) {
        employeeAttendance[record.employeeId] = {
          employeeId: record.employeeId,
          totalDays: 0,
          hoursWorked: 0,
        };

    // Calculate working days in the period
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalWorkingDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return {
      period: { startDate, endDate },
      totalWorkingDays,
      employeeSummary: Object.values(employeeAttendance).map((summary: any) => ({
        ...summary,
        attendanceRate: totalWorkingDays > 0 
          ? ((summary.present + summary.late + summary.halfDay) / totalWorkingDays * 100).toFixed(2)
          : 0,
      })),
      overallStats: {
        totalRecords: attendanceRecords.length,
        presentCount: attendanceRecords.filter(r => r.status === AttendanceStatus.PRESENT).length,
        absentCount: attendanceRecords.filter(r => r.status === AttendanceStatus.ABSENT).length,
        lateCount: attendanceRecords.filter(r => r.status === AttendanceStatus.LATE).length,
        overtimeCount: attendanceRecords.filter(r => r.status === AttendanceStatus.OVERTIME).length,
      },
    };
  }

  async getDailyAttendanceReport(date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const attendance = await this.attendanceRepository.find({
      where: {
        checkInTime: Between(startDate, endDate),
      },
      relations: ['employee'],
      order: { checkInTime: 'ASC' },
    });

    const totalEmployees = await this.employeeRepository.count({
      where: { status: 'active' },
    });

    return {
      date,
      totalEmployees,
      recordedAttendance: attendance.length,
      unrecordedCount: totalEmployees - attendance.length,
      attendance: attendance.map(record => ({
        id: record.id,
        employee: {
          id: record.employee.id,
          name: record.employee.fullName,
          department: record.employee.department,
        },
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        hoursWorked: this.calculateHoursWorked(record.checkInTime, record.checkOutTime),
        notes: record.notes,
      })),
    };
  }

  private calculateHoursWorked(checkIn: Date, checkOut?: Date): number {
    if (!checkOut) return 0;
    
    const diffMs = checkOut.getTime() - checkIn.getTime();
    return Number((diffMs / (1000 * 60 * 60)).toFixed(2));
  }
}