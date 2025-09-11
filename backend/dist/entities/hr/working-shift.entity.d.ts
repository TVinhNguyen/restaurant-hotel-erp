import { Property } from '../core/property.entity';
import { Employee } from '../core/employee.entity';
import { Attendance } from './attendance.entity';
import { Overtime } from './overtime.entity';
export declare class WorkingShift {
    id: string;
    propertyId: string;
    employeeId: string;
    workingDate: Date;
    startTime: string;
    endTime: string;
    shiftType: 'morning' | 'night' | 'other';
    notes: string;
    isReassigned: boolean;
    createdAt: Date;
    updatedAt: Date;
    property: Property;
    employee: Employee;
    attendances: Attendance[];
    overtimes: Overtime[];
}
