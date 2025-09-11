import { Employee } from '../core/employee.entity';
export declare class EmployeeEvaluation {
    id: string;
    employeeId: string;
    evaluatedBy: string;
    rate: number;
    period: 'quarterly' | 'annual';
    goals: string;
    strength: string;
    improvement: string;
    comments: string;
    createdAt: Date;
    updatedAt: Date;
    employee: Employee;
    evaluator: Employee;
}
