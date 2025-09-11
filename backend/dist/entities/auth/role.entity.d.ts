import { EmployeeRole } from '../core/employee-role.entity';
export declare class Role {
    id: string;
    name: string;
    description: string;
    scope: 'global' | 'per_property';
    employeeRoles: EmployeeRole[];
}
