import { DeductionsService } from './deductions.service';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';
export declare class DeductionsController {
    private readonly deductionsService;
    constructor(deductionsService: DeductionsService);
    create(createDeductionDto: CreateDeductionDto): Promise<import("../entities").Deduction>;
    findAll(page?: string, limit?: string, employeeId?: string, type?: string, startDate?: string, endDate?: string): Promise<{
        data: import("../entities").Deduction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByEmployee(employeeId: string, page?: string, limit?: string): Promise<{
        data: import("../entities").Deduction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByType(type: string, page?: string, limit?: string): Promise<{
        data: import("../entities").Deduction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByDateRange(startDate: string, endDate: string, page?: string, limit?: string): Promise<{
        data: import("../entities").Deduction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getTotalDeductionsByEmployee(employeeId: string, startDate?: string, endDate?: string): Promise<{
        employeeId: string;
        totalDeductions: number;
        period: string | {
            startDate: string;
            endDate: string;
        };
    }>;
    findOne(id: string): Promise<import("../entities").Deduction>;
    update(id: string, updateDeductionDto: UpdateDeductionDto): Promise<import("../entities").Deduction>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
