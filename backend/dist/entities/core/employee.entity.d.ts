import { User } from '../auth/user.entity';
import { EmployeeRole } from './employee-role.entity';
import { WorkingShift } from '../hr/working-shift.entity';
import { Attendance } from '../hr/attendance.entity';
import { Leave } from '../hr/leave.entity';
import { EmployeeEvaluation } from '../hr/employee-evaluation.entity';
import { Payroll } from '../hr/payroll.entity';
import { Overtime } from '../hr/overtime.entity';
import { Deduction } from '../hr/deduction.entity';
export declare class Employee {
    id: string;
    userId: string;
    employeeCode: string;
    fullName: string;
    department: 'Front Desk' | 'Housekeeping' | 'HR' | 'F&B';
    status: 'active' | 'on_leave' | 'terminated';
    hireDate: Date;
    terminationDate: Date;
    user: User;
    employeeRoles: EmployeeRole[];
    workingShifts: WorkingShift[];
    attendances: Attendance[];
    leaves: Leave[];
    evaluations: EmployeeEvaluation[];
    payrolls: Payroll[];
    overtimes: Overtime[];
    deductions: Deduction[];
}
