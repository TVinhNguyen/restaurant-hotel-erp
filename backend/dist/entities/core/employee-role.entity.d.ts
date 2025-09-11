import { Employee } from './employee.entity';
import { Property } from './property.entity';
import { Role } from '../auth/role.entity';
export declare class EmployeeRole {
    id: string;
    employeeId: string;
    propertyId: string;
    roleId: string;
    effectiveFrom: Date;
    effectiveTo: Date;
    employee: Employee;
    property: Property;
    role: Role;
}
