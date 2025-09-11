import { Employee } from '../core/employee.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    phone: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    employee: Employee;
}
