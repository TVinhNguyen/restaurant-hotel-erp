import { Repository } from 'typeorm';
import { EmployeeEvaluation } from '../entities/hr/employee-evaluation.entity';
import { CreateEmployeeEvaluationDto } from './dto/create-employee-evaluation.dto';
import { UpdateEmployeeEvaluationDto } from './dto/update-employee-evaluation.dto';
export declare class EmployeeEvaluationsService {
    private employeeEvaluationRepository;
    constructor(employeeEvaluationRepository: Repository<EmployeeEvaluation>);
    create(createEmployeeEvaluationDto: CreateEmployeeEvaluationDto): Promise<EmployeeEvaluation>;
    findAll(page?: number, limit?: number, employeeId?: string, evaluatedBy?: string, period?: string, rateMin?: number, rateMax?: number): Promise<{
        data: EmployeeEvaluation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<EmployeeEvaluation>;
    update(id: string, updateEmployeeEvaluationDto: UpdateEmployeeEvaluationDto): Promise<EmployeeEvaluation>;
    remove(id: string): Promise<void>;
    findByEmployee(employeeId: string, page?: number, limit?: number): Promise<{
        data: EmployeeEvaluation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByEvaluator(evaluatedBy: string, page?: number, limit?: number): Promise<{
        data: EmployeeEvaluation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByPeriod(period: string, page?: number, limit?: number): Promise<{
        data: EmployeeEvaluation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByRateRange(rateMin: number, rateMax: number, page?: number, limit?: number): Promise<{
        data: EmployeeEvaluation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAverageRateByEmployee(employeeId: string): Promise<{
        employeeId: string;
        averageRate: number;
        totalEvaluations: number;
    }>;
    getEvaluationStatsByPeriod(period: string): Promise<{
        period: string;
        averageRate: number;
        totalEvaluations: number;
        minRate: number;
        maxRate: number;
    }>;
}
