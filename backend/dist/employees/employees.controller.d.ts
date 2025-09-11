import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(page?: string, limit?: string, department?: string, status?: string, search?: string): Promise<{
        data: import("../entities").Employee[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").Employee>;
    create(createEmployeeDto: CreateEmployeeDto): Promise<import("../entities").Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<import("../entities").Employee>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
