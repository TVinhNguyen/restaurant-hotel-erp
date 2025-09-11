export declare enum LeaveType {
    ANNUAL = "annual",
    SICK = "sick",
    UNPAID = "unpaid",
    OTHER = "other"
}
export declare enum LeaveStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class CreateLeaveDto {
    employeeId: string;
    leaveDate: string;
    numberOfDays?: number;
    leaveType: LeaveType;
    status?: LeaveStatus;
    reason: string;
    approvedBy?: string;
    hrNote?: string;
}
export declare class UpdateLeaveDto {
    leaveDate?: string;
    numberOfDays?: number;
    leaveType?: LeaveType;
    status?: LeaveStatus;
    reason?: string;
    approvedBy?: string;
    hrNote?: string;
}
export declare class ApproveRejectLeaveDto {
    status: LeaveStatus.APPROVED | LeaveStatus.REJECTED;
    hrNote?: string;
}
