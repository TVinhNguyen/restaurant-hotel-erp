import { Repository } from 'typeorm';
import { Leave } from '../entities/hr/leave.entity';
import { Employee } from '../entities/core/employee.entity';
import { CreateLeaveDto, UpdateLeaveDto, ApproveRejectLeaveDto, LeaveType, LeaveStatus } from './dto/create-leave.dto';
export declare class LeaveService {
    private leaveRepository;
    private employeeRepository;
    constructor(leaveRepository: Repository<Leave>, employeeRepository: Repository<Employee>);
    createLeave(createLeaveDto: CreateLeaveDto): Promise<Leave>;
    findAllLeaves(page?: number, limit?: number, employeeId?: string, status?: LeaveStatus, leaveType?: LeaveType, startDate?: string, endDate?: string): Promise<{
        data: Leave[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findLeaveById(id: string): Promise<Leave>;
    updateLeave(id: string, updateLeaveDto: UpdateLeaveDto): Promise<Leave>;
    deleteLeave(id: string): Promise<void>;
    approveRejectLeave(id: string, approveRejectDto: ApproveRejectLeaveDto, approverId: string): Promise<Leave>;
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
    getPendingLeaves(): Promise<Leave[]>;
    getEmployeeLeaveBalance(employeeId: string, year?: number): Promise<any>;
}
