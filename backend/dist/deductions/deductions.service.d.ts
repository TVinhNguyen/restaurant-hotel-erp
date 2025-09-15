import { Repository } from 'typeorm';
import { Deduction } from '../entities/hr/deduction.entity';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';
export declare class DeductionsService {
    private deductionRepository;
    constructor(deductionRepository: Repository<Deduction>);
    create(createDeductionDto: CreateDeductionDto): Promise<Deduction>;
    findAll(page?: number, limit?: number, employeeId?: string, type?: string, startDate?: string, endDate?: string): Promise<{
        data: Deduction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Deduction>;
    update(id: string, updateDeductionDto: UpdateDeductionDto): Promise<Deduction>;
    remove(id: string): Promise<void>;
    findByEmployee(employeeId: string, page?: number, limit?: number): Promise<{
        data: Deduction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByType(type: string, page?: number, limit?: number): Promise<{
        data: Deduction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByDateRange(startDate: string, endDate: string, page?: number, limit?: number): Promise<{
        data: Deduction[];
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
}
