import { Repository } from 'typeorm';
import { Payroll } from '../entities/hr/payroll.entity';
import { Employee } from '../entities/core/employee.entity';
import { Overtime } from '../entities/hr/overtime.entity';
import { Deduction } from '../entities/hr/deduction.entity';
import { CreatePayrollDto, UpdatePayrollDto, BulkPayrollDto } from './dto/create-payroll.dto';
export declare class PayrollService {
    private payrollRepository;
    private employeeRepository;
    private overtimeRepository;
    private deductionRepository;
    constructor(payrollRepository: Repository<Payroll>, employeeRepository: Repository<Employee>, overtimeRepository: Repository<Overtime>, deductionRepository: Repository<Deduction>);
    createPayroll(createPayrollDto: CreatePayrollDto): Promise<Payroll>;
    findAllPayrolls(page?: number, limit?: number, employeeId?: string, period?: string): Promise<{
        data: Payroll[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findPayrollById(id: string): Promise<Payroll>;
    updatePayroll(id: string, updatePayrollDto: UpdatePayrollDto): Promise<Payroll>;
    deletePayroll(id: string): Promise<void>;
    bulkCreatePayroll(bulkPayrollDto: BulkPayrollDto): Promise<Payroll[]>;
    generatePayrollWithCalculations(period: string, employeeId?: string): Promise<any[]>;
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
}
