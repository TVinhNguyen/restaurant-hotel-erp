import { Employee } from '../core/employee.entity';
import { WorkingShift } from './working-shift.entity';
export declare class Overtime {
    id: string;
    employeeId: string;
    workingShiftId: string;
    numberOfHours: number;
    rate: number;
    amount: number;
    approvedBy: string;
    createdAt: Date;
    updatedAt: Date;
    employee: Employee;
    workingShift: WorkingShift;
    approver: Employee;
}
