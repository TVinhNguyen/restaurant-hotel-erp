export declare enum PayrollStatus {
    PENDING = "pending",
    PROCESSED = "processed",
    PAID = "paid",
    CANCELLED = "cancelled"
}
export declare class CreatePayrollDto {
    employeeId: string;
    period: string;
    basicSalary: number;
    netSalary: number;
    bonus?: number;
    currency: string;
}
export declare class UpdatePayrollDto {
    period?: string;
    basicSalary?: number;
    netSalary?: number;
    bonus?: number;
    currency?: string;
}
export declare class BulkPayrollDto {
    period: string;
    payrolls: Array<{
        employeeId: string;
        basicSalary: number;
        netSalary: number;
        bonus?: number;
        currency: string;
    }>;
}
