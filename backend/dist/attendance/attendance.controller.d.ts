import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto, BulkAttendanceDto, AttendanceStatus } from './dto/create-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    createAttendance(createAttendanceDto: CreateAttendanceDto): Promise<import("../entities").Attendance>;
    bulkCreateAttendance(bulkAttendanceDto: BulkAttendanceDto): Promise<import("../entities").Attendance[]>;
    findAllAttendance(page?: number, limit?: number, employeeId?: string, date?: string, status?: AttendanceStatus, startDate?: string, endDate?: string): Promise<{
        data: import("../entities").Attendance[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
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
            id: string;
            employee: {
                id: string;
                name: string;
                department: "Front Desk" | "Housekeeping" | "HR" | "F&B";
            };
            checkInTime: Date;
            checkOutTime: Date;
            hoursWorked: number;
            notes: string;
        }[];
    }>;
    findAttendanceById(id: string): Promise<import("../entities").Attendance>;
    updateAttendance(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<import("../entities").Attendance>;
    deleteAttendance(id: string): Promise<{
        message: string;
    }>;
    checkIn(employeeId: string): Promise<import("../entities").Attendance>;
    checkOut(employeeId: string): Promise<import("../entities").Attendance>;
}
