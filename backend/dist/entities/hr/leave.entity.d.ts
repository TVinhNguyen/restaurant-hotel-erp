import { Employee } from '../core/employee.entity';
export declare class Leave {
    id: string;
    employeeId: string;
    leaveDate: Date;
    numberOfDays: number;
    leaveType: 'annual' | 'sick' | 'unpaid' | 'other';
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
    approvedBy: string;
    hrNote: string;
    createdAt: Date;
    updatedAt: Date;
    employee: Employee;
    approver: Employee;
}
