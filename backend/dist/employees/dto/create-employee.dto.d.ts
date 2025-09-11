export declare class CreateEmployeeDto {
    userId?: string;
    employeeCode?: string;
    fullName: string;
    department?: 'Front Desk' | 'Housekeeping' | 'HR' | 'F&B';
    status?: 'active' | 'on_leave' | 'terminated';
    hireDate?: string;
    terminationDate?: string;
}
