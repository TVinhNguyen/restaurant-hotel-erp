import { Repository } from 'typeorm';
import { Attendance } from '../entities/hr/attendance.entity';
import { Employee } from '../entities/core/employee.entity';
import { CreateAttendanceDto, UpdateAttendanceDto, BulkAttendanceDto } from './dto/create-attendance.dto';
export declare class AttendanceService {
    private attendanceRepository;
    private employeeRepository;
    constructor(attendanceRepository: Repository<Attendance>, employeeRepository: Repository<Employee>);
    createAttendance(createAttendanceDto: CreateAttendanceDto): Promise<Attendance>;
    findAllAttendance(page?: number, limit?: number, employeeId?: string, date?: string, startDate?: string, endDate?: string): Promise<{
        data: Attendance[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAttendanceById(id: string): Promise<Attendance>;
    updateAttendance(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance>;
    deleteAttendance(id: string): Promise<void>;
    checkIn(employeeId: string): Promise<Attendance>;
    checkOut(employeeId: string): Promise<Attendance>;
    bulkCreateAttendance(bulkAttendanceDto: BulkAttendanceDto): Promise<Attendance[]>;
    getAttendanceSummary(startDate: string, endDate: string, employeeId?: string): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        totalWorkingDays: number;
        employeeSummary: any[];
        overallStats: {
            totalRecords: number;
            presentCount: number;
            absentCount: number;
            lateCount: number;
            overtimeCount: number;
        };
    }>;
    getDailyAttendanceReport(date: string): Promise<{
        date: string;
        totalEmployees: number;
        recordedAttendance: number;
        unrecordedCount: number;
        attendance: {
            id: any;
            employee: {
                id: any;
                name: any;
                department: any;
            };
            checkInTime: any;
            checkOutTime: any;
            hoursWorked: number;
            notes: any;
        }[];
    }>;
    private calculateHoursWorked;
}
