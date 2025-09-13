import { Employee } from '../core/employee.entity';
import { WorkingShift } from './working-shift.entity';
export declare class Attendance {
    id: string;
    employeeId: string;
    workingShiftId: string;
    checkInTime: Date;
    checkOutTime: Date;
    notes: string;
    employee: Employee;
    workingShift: WorkingShift;
}
