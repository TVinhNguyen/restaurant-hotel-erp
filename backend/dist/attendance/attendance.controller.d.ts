import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto, BulkAttendanceDto } from './dto/create-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    createAttendance(createAttendanceDto: CreateAttendanceDto): Promise<import("../entities").Attendance>;
    bulkCreateAttendance(bulkAttendanceDto: BulkAttendanceDto): Promise<import("../entities").Attendance[]>;
    findAllAttendance(page?: number, limit?: number, employeeId?: string, date?: string, startDate?: string, endDate?: string): Promise<{
        data: import("../entities").Attendance[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAttendanceSummary(startDate: string, endDate: string, employeeId?: string): Promise<void>;
    getDailyAttendanceReport(date: string): Promise<any>;
    findAttendanceById(id: string): Promise<import("../entities").Attendance>;
    updateAttendance(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<import("../entities").Attendance>;
    deleteAttendance(id: string): Promise<{
        message: string;
    }>;
    checkIn(employeeId: string): Promise<import("../entities").Attendance>;
    checkOut(employeeId: string): Promise<import("../entities").Attendance>;
}
