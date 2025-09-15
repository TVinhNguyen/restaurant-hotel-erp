import { EmployeeEvaluationsService } from './employee-evaluations.service';
import { CreateEmployeeEvaluationDto } from './dto/create-employee-evaluation.dto';
import { UpdateEmployeeEvaluationDto } from './dto/update-employee-evaluation.dto';
export declare class EmployeeEvaluationsController {
    private readonly employeeEvaluationsService;
    constructor(employeeEvaluationsService: EmployeeEvaluationsService);
    create(createEmployeeEvaluationDto: CreateEmployeeEvaluationDto): Promise<import("../entities").EmployeeEvaluation>;
    findAll(page?: string, limit?: string, employeeId?: string, evaluatedBy?: string, period?: string, rateMin?: string, rateMax?: string): Promise<{
        data: import("../entities").EmployeeEvaluation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByEmployee(employeeId: string, page?: string, limit?: string): Promise<{
        data: import("../entities").EmployeeEvaluation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByEvaluator(evaluatedBy: string, page?: string, limit?: string): Promise<{
        data: import("../entities").EmployeeEvaluation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByPeriod(period: string, page?: string, limit?: string): Promise<{
        data: import("../entities").EmployeeEvaluation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByRateRange(rateMin: string, rateMax: string, page?: string, limit?: string): Promise<{
        data: import("../entities").EmployeeEvaluation[];
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
    findOne(id: string): Promise<import("../entities").EmployeeEvaluation>;
    update(id: string, updateEmployeeEvaluationDto: UpdateEmployeeEvaluationDto): Promise<import("../entities").EmployeeEvaluation>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
