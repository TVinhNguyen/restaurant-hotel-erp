import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from '../entities/hr/attendance.entity';
import { Employee } from '../entities/core/employee.entity';
import {
  CreateAttendanceDto,
  BulkAttendanceDto,
  AttendanceStatus
} from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>
  ) {}

  async createAttendance(
    createAttendanceDto: CreateAttendanceDto
  ): Promise<Attendance> {
    // Check if employee exists
    const employee = await this.employeeRepository.findOne({
      where: { id: createAttendanceDto.employeeId }
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createAttendanceDto.employeeId} not found`
      );
    }

    const attendanceData = {
      employeeId: createAttendanceDto.employeeId,
      workingShiftId: createAttendanceDto.workingShiftId,
      date: createAttendanceDto.date,
      checkInTime: createAttendanceDto.checkInTime
        ? new Date(createAttendanceDto.checkInTime)
        : undefined,
      checkOutTime: createAttendanceDto.checkOutTime
        ? new Date(createAttendanceDto.checkOutTime)
        : undefined,
      status: createAttendanceDto.status || 'present',
      notes: createAttendanceDto.notes
    };

    const attendance = this.attendanceRepository.create(attendanceData);
    return await this.attendanceRepository.save(attendance);
  }

  async findAllAttendance(
    page: number = 1,
    limit: number = 10,
    employeeId?: string,
    date?: string,
    startDate?: string,
    endDate?: string
  ) {
    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .leftJoinAndSelect('attendance.workingShift', 'workingShift');

    if (employeeId) {
      queryBuilder.andWhere('attendance.employeeId = :employeeId', {
        employeeId
      });
    }

    if (date) {
      queryBuilder.andWhere('attendance.date = :date', { date });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('attendance.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    }

    const [attendance, total] = await queryBuilder
      .orderBy('attendance.date', 'DESC')
      .addOrderBy('attendance.checkInTime', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: attendance,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findAttendanceById(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['employee', 'workingShift']
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async updateAttendance(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto
  ): Promise<Attendance> {
    await this.findAttendanceById(id);

    // If employeeId is being updated, validate that the employee exists
    if (updateAttendanceDto.employeeId) {
      const employee = await this.employeeRepository.findOne({
        where: { id: updateAttendanceDto.employeeId }
      });
      if (!employee) {
        throw new NotFoundException(
          `Employee with ID ${updateAttendanceDto.employeeId} not found`
        );
      }
    }

    const updateData: any = {};
    if (updateAttendanceDto.employeeId !== undefined)
      updateData.employeeId = updateAttendanceDto.employeeId;
    if (updateAttendanceDto.workingShiftId !== undefined)
      updateData.workingShiftId = updateAttendanceDto.workingShiftId;
    if (updateAttendanceDto.date !== undefined)
      updateData.date = updateAttendanceDto.date;
    if (updateAttendanceDto.checkInTime !== undefined)
      updateData.checkInTime = updateAttendanceDto.checkInTime
        ? new Date(updateAttendanceDto.checkInTime)
        : null;
    if (updateAttendanceDto.checkOutTime !== undefined)
      updateData.checkOutTime = updateAttendanceDto.checkOutTime
        ? new Date(updateAttendanceDto.checkOutTime)
        : null;
    if (updateAttendanceDto.status !== undefined)
      updateData.status = updateAttendanceDto.status;
    if (updateAttendanceDto.notes !== undefined)
      updateData.notes = updateAttendanceDto.notes;

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
        checkInTime: Between(today, tomorrow)
      }
    });

    if (existingAttendance) {
      throw new BadRequestException('Already checked in today');
    }

    const attendance = this.attendanceRepository.create({
      employeeId,
      checkInTime: new Date()
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
        checkInTime: Between(today, tomorrow)
      }
    });

    if (!attendance) {
      throw new NotFoundException('No check-in record found for today');
    }

    if (attendance.checkOutTime) {
      throw new BadRequestException('Already checked out today');
    }

    await this.attendanceRepository.update(attendance.id, {
      checkOutTime: new Date()
    });

    return this.findAttendanceById(attendance.id);
  }

  async bulkCreateAttendance(
    bulkAttendanceDto: BulkAttendanceDto
  ): Promise<Attendance[]> {
    const { date, attendances } = bulkAttendanceDto;

    if (!date) {
      throw new BadRequestException(
        'Date is required for bulk attendance creation'
      );
    }

    // Convert date to date range for checking existing records
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Check for existing attendance records
    const existingAttendances = await this.attendanceRepository.find({
      where: {
        checkInTime: Between(startDate, endDate)
      }
    });

    const existingEmployeeIds = existingAttendances.map(att => att.employeeId);

    if (!attendances || attendances.length === 0) {
      throw new BadRequestException('No attendance records provided');
    }

    // Filter out employees who already have attendance for this date
    const newAttendances = attendances.filter(
      (att: any) => !existingEmployeeIds.includes(att.employeeId)
    );

    if (newAttendances.length === 0) {
      throw new BadRequestException(
        'All employees already have attendance records for this date'
      );
    }

    const attendanceEntities = newAttendances.map((att: any) => {
      return this.attendanceRepository.create({
        employeeId: att.employeeId,
        checkInTime: att.checkInTime ? new Date(att.checkInTime) : undefined,
        checkOutTime: att.checkOutTime ? new Date(att.checkOutTime) : undefined,
        notes: att.notes
      });
    });

    return await this.attendanceRepository.save(attendanceEntities);
  }

  async getAllAttendances() {
    const attendances = await this.attendanceRepository.find({
      relations: ['employee', 'workingShift'],
      order: { date: 'DESC', checkInTime: 'DESC' }
    });

    return {
      data: attendances,
      total: attendances.length
    };
  }

  async getAttendanceSummary(
    startDate: string,
    endDate: string,
    employeeId?: string
  ) {
    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoin('attendance.employee', 'employee')
      .where('attendance.checkInTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });

    if (employeeId) {
      queryBuilder.andWhere('attendance.employeeId = :employeeId', {
        employeeId
      });
    }

    const attendanceRecords = await queryBuilder.getMany();

    // Group by employee
    const employeeAttendance: { [key: string]: any } = {};

    attendanceRecords.forEach((record: any) => {
      if (!employeeAttendance[record.employeeId]) {
        employeeAttendance[record.employeeId] = {
          employeeId: record.employeeId,
          totalDays: 0,
          hoursWorked: 0,
          present: 0,
          absent: 0,
          late: 0,
          halfDay: 0
        };
      }

      // Calculate hours worked for this record
      const hours = this.calculateHoursWorked(
        record.checkInTime,
        record.checkOutTime
      );
      employeeAttendance[record.employeeId].hoursWorked += hours;
      employeeAttendance[record.employeeId].totalDays += 1;

      // You can add status calculation logic here based on your business rules
      employeeAttendance[record.employeeId].present += 1;
    });

    // Calculate working days in the period
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalWorkingDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      period: { startDate, endDate },
      totalWorkingDays,
      employeeSummary: Object.values(employeeAttendance).map(
        (summary: any) => ({
          ...summary,
          attendanceRate:
            totalWorkingDays > 0
              ? (
                  ((summary.present + summary.late + summary.halfDay) /
                    totalWorkingDays) *
                  100
                ).toFixed(2)
              : 0
        })
      ),
      overallStats: {
        totalRecords: attendanceRecords.length,
        presentCount: attendanceRecords.length, // Simplified for now
        absentCount: 0,
        lateCount: 0,
        overtimeCount: 0
      }
    };
  }

  async getDailyAttendanceReport(date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const attendance = await this.attendanceRepository.find({
      where: {
        checkInTime: Between(startDate, endDate)
      },
      relations: ['employee'],
      order: { checkInTime: 'ASC' }
    });

    const totalEmployees = await this.employeeRepository.count({
      where: { status: 'active' }
    });

    return {
      date,
      totalEmployees,
      recordedAttendance: attendance.length,
      unrecordedCount: totalEmployees - attendance.length,
      attendance: attendance.map((record: any) => ({
        id: record.id,
        employee: {
          id: record.employee.id,
          name: record.employee.fullName,
          department: record.employee.department
        },
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        hoursWorked: this.calculateHoursWorked(
          record.checkInTime,
          record.checkOutTime
        ),
        notes: record.notes
      }))
    };
  }

  private calculateHoursWorked(checkIn: Date, checkOut?: Date): number {
    if (!checkOut) return 0;

    const diffMs = checkOut.getTime() - checkIn.getTime();
    return Number((diffMs / (1000 * 60 * 60)).toFixed(2));
  }
}
