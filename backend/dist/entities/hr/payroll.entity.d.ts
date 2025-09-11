import { Employee } from '../core/employee.entity';
export declare class Payroll {
    id: string;
    employeeId: string;
    period: string;
    basicSalary: number;
    netSalary: number;
    bonus: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    employee: Employee;
}
