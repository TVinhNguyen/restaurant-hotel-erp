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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("../entities/hr/attendance.entity");
const employee_entity_1 = require("../entities/core/employee.entity");
let AttendanceService = class AttendanceService {
    attendanceRepository;
    employeeRepository;
    constructor(attendanceRepository, employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }
    async createAttendance(createAttendanceDto) {
        const employee = await this.employeeRepository.findOne({
            where: { id: createAttendanceDto.employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${createAttendanceDto.employeeId} not found`);
        }
        const attendanceData = {
            employeeId: createAttendanceDto.employeeId,
            workingShiftId: createAttendanceDto.workingShiftId,
            checkInTime: createAttendanceDto.checkInTime ? new Date(createAttendanceDto.checkInTime) : undefined,
            checkOutTime: createAttendanceDto.checkOutTime ? new Date(createAttendanceDto.checkOutTime) : undefined,
            notes: createAttendanceDto.notes,
        };
        const attendance = this.attendanceRepository.create(attendanceData);
        return await this.attendanceRepository.save(attendance);
    }
    async findAllAttendance(page = 1, limit = 10, employeeId, date, startDate, endDate) {
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
    async findAttendanceById(id) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
            relations: ['employee', 'workingShift'],
        });
        if (!attendance) {
            throw new common_1.NotFoundException(`Attendance with ID ${id} not found`);
        }
        return attendance;
    }
    async updateAttendance(id, updateAttendanceDto) {
        await this.findAttendanceById(id);
        const updateData = {};
        if (updateAttendanceDto.workingShiftId !== undefined)
            updateData.workingShiftId = updateAttendanceDto.workingShiftId;
        if (updateAttendanceDto.checkInTime !== undefined)
            updateData.checkInTime = new Date(updateAttendanceDto.checkInTime);
        if (updateAttendanceDto.checkOutTime !== undefined)
            updateData.checkOutTime = new Date(updateAttendanceDto.checkOutTime);
        if (updateAttendanceDto.notes !== undefined)
            updateData.notes = updateAttendanceDto.notes;
        await this.attendanceRepository.update(id, updateData);
        return this.findAttendanceById(id);
    }
    async deleteAttendance(id) {
        const attendance = await this.findAttendanceById(id);
        await this.attendanceRepository.remove(attendance);
    }
    async checkIn(employeeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const existingAttendance = await this.attendanceRepository.findOne({
            where: {
                employeeId,
                checkInTime: (0, typeorm_2.Between)(today, tomorrow),
            },
        });
        if (existingAttendance) {
            throw new common_1.BadRequestException('Already checked in today');
        }
        const attendance = this.attendanceRepository.create({
            employeeId,
            checkInTime: new Date(),
        });
        return await this.attendanceRepository.save(attendance);
    }
    async checkOut(employeeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const attendance = await this.attendanceRepository.findOne({
            where: {
                employeeId,
                checkInTime: (0, typeorm_2.Between)(today, tomorrow),
            },
        });
        if (!attendance) {
            throw new common_1.NotFoundException('No check-in record found for today');
        }
        if (attendance.checkOutTime) {
            throw new common_1.BadRequestException('Already checked out today');
        }
        await this.attendanceRepository.update(attendance.id, {
            checkOutTime: new Date(),
        });
        return this.findAttendanceById(attendance.id);
    }
    async bulkCreateAttendance(bulkAttendanceDto) {
        const { date, attendances } = bulkAttendanceDto;
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const existingAttendances = await this.attendanceRepository.find({
            where: {
                checkInTime: (0, typeorm_2.Between)(startDate, endDate)
            },
        });
        const existingEmployeeIds = existingAttendances.map(att => att.employeeId);
        const newAttendances = attendances.filter(att => !existingEmployeeIds.includes(att.employeeId));
        if (newAttendances.length === 0) {
            throw new common_1.BadRequestException('All employees already have attendance records for this date');
        }
        const attendanceEntities = newAttendances.map(att => {
            return this.attendanceRepository.create({
                employeeId: att.employeeId,
                checkInTime: att.checkInTime ? new Date(att.checkInTime) : undefined,
                checkOutTime: att.checkOutTime ? new Date(att.checkOutTime) : undefined,
                notes: att.notes,
            });
        });
        return await this.attendanceRepository.save(attendanceEntities);
    }
    async getAttendanceSummary(startDate, endDate, employeeId) {
        const queryBuilder = this.attendanceRepository
            .createQueryBuilder('attendance')
            .leftJoin('attendance.employee', 'employee')
            .where('attendance.checkInTime BETWEEN :startDate AND :endDate', { startDate, endDate });
        if (employeeId) {
            queryBuilder.andWhere('attendance.employeeId = :employeeId', { employeeId });
        }
        const attendanceRecords = await queryBuilder.getMany();
        const employeeAttendance = {};
        attendanceRecords.forEach((record) => {
            if (!employeeAttendance[record.employeeId]) {
                employeeAttendance[record.employeeId] = {
                    employeeId: record.employeeId,
                    totalDays: 0,
                    hoursWorked: 0,
                    present: 0,
                    absent: 0,
                    late: 0,
                    halfDay: 0,
                };
            }
            const hours = this.calculateHoursWorked(record.checkInTime, record.checkOutTime);
            employeeAttendance[record.employeeId].hoursWorked += hours;
            employeeAttendance[record.employeeId].totalDays += 1;
            employeeAttendance[record.employeeId].present += 1;
        });
        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalWorkingDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return {
            period: { startDate, endDate },
            totalWorkingDays,
            employeeSummary: Object.values(employeeAttendance).map((summary) => ({
                ...summary,
                attendanceRate: totalWorkingDays > 0
                    ? ((summary.present + summary.late + summary.halfDay) / totalWorkingDays * 100).toFixed(2)
                    : 0,
            })),
            overallStats: {
                totalRecords: attendanceRecords.length,
                presentCount: attendanceRecords.length,
                absentCount: 0,
                lateCount: 0,
                overtimeCount: 0,
            },
        };
    }
    async getDailyAttendanceReport(date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const attendance = await this.attendanceRepository.find({
            where: {
                checkInTime: (0, typeorm_2.Between)(startDate, endDate),
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
            attendance: attendance.map((record) => ({
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
    calculateHoursWorked(checkIn, checkOut) {
        if (!checkOut)
            return 0;
        const diffMs = checkOut.getTime() - checkIn.getTime();
        return Number((diffMs / (1000 * 60 * 60)).toFixed(2));
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map