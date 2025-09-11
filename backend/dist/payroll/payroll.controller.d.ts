import { PayrollService } from './payroll.service';
import { CreatePayrollDto, UpdatePayrollDto, BulkPayrollDto } from './dto/create-payroll.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    createPayroll(createPayrollDto: CreatePayrollDto): Promise<import("../entities").Payroll>;
    bulkCreatePayroll(bulkPayrollDto: BulkPayrollDto): Promise<import("../entities").Payroll[]>;
    generatePayrollWithCalculations(period: string, employeeId?: string): Promise<any[]>;
    findAllPayrolls(page?: number, limit?: number, employeeId?: string, period?: string): Promise<{
        data: import("../entities").Payroll[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPayrollSummary(period: string, employeeId?: string): Promise<{
        period: string;
        totalEmployees: number;
        totalBasicSalary: number;
        totalNetSalary: number;
        totalBonuses: number;
        currencyBreakdown: {
            [key: string]: number;
        };
    }>;
    findPayrollById(id: string): Promise<import("../entities").Payroll>;
    updatePayroll(id: string, updatePayrollDto: UpdatePayrollDto): Promise<import("../entities").Payroll>;
    deletePayroll(id: string): Promise<{
        message: string;
    }>;
}
