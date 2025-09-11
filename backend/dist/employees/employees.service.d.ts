import { Repository } from 'typeorm';
import { Employee } from '../entities/core/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesService {
    private employeeRepository;
    constructor(employeeRepository: Repository<Employee>);
    findAll(query: {
        page?: number;
        limit?: number;
        department?: string;
        status?: string;
        search?: string;
    }): Promise<{
        data: Employee[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<Employee>;
    create(createEmployeeDto: CreateEmployeeDto): Promise<Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    remove(id: string): Promise<void>;
    private generateEmployeeCode;
}
