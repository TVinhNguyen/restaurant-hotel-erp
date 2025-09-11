import { Employee } from '../core/employee.entity';
import { Leave } from './leave.entity';
export declare class Deduction {
    id: string;
    employeeId: string;
    leaveId: string;
    type: 'tax' | 'insurance' | 'other';
    amount: number;
    date: Date;
    reasonDetails: string;
    createdAt: Date;
    updatedAt: Date;
    employee: Employee;
    leave: Leave;
}
