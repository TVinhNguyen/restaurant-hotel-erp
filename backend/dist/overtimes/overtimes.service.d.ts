import { Repository } from 'typeorm';
import { Overtime } from '../entities/hr/overtime.entity';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
export declare class OvertimesService {
    private overtimeRepository;
    constructor(overtimeRepository: Repository<Overtime>);
    create(createOvertimeDto: CreateOvertimeDto): Promise<Overtime>;
    findAll(page?: number, limit?: number, employeeId?: string, workingShiftId?: string, approvedBy?: string): Promise<{
        data: Overtime[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Overtime>;
    update(id: string, updateOvertimeDto: UpdateOvertimeDto): Promise<Overtime>;
    remove(id: string): Promise<void>;
    findByEmployee(employeeId: string, page?: number, limit?: number): Promise<{
        data: Overtime[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByWorkingShift(workingShiftId: string, page?: number, limit?: number): Promise<{
        data: Overtime[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByApprover(approvedBy: string, page?: number, limit?: number): Promise<{
        data: Overtime[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getTotalOvertimeByEmployee(employeeId: string): Promise<{
        employeeId: string;
        totalAmount: number;
        totalHours: number;
    }>;
    calculateOvertimeAmount(numberOfHours: number, rate: number): Promise<number>;
}
