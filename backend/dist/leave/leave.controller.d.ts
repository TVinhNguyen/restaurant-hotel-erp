import { LeaveService } from './leave.service';
import { CreateLeaveDto, UpdateLeaveDto, ApproveRejectLeaveDto, LeaveType, LeaveStatus } from './dto/create-leave.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    createLeave(createLeaveDto: CreateLeaveDto): Promise<import("../entities").Leave>;
    findAllLeaves(page?: number, limit?: number, employeeId?: string, status?: LeaveStatus, leaveType?: LeaveType, startDate?: string, endDate?: string): Promise<{
        data: import("../entities").Leave[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPendingLeaves(): Promise<import("../entities").Leave[]>;
    getLeaveSummary(startDate: string, endDate: string, employeeId?: string): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        totalRequests: number;
        statusBreakdown: {
            [key: string]: number;
        };
        typeBreakdown: {
            [key: string]: number;
        };
        totalDaysRequested: number;
        approvedDays: number;
    }>;
    getEmployeeLeaveBalance(employeeId: string, year?: number): Promise<any>;
    findLeaveById(id: string): Promise<import("../entities").Leave>;
    updateLeave(id: string, updateLeaveDto: UpdateLeaveDto): Promise<import("../entities").Leave>;
    deleteLeave(id: string): Promise<{
        message: string;
    }>;
    approveRejectLeave(id: string, approveRejectDto: ApproveRejectLeaveDto, approverId: string): Promise<import("../entities").Leave>;
}
