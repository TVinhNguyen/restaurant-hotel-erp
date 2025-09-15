import { Repository } from 'typeorm';
import { WorkingShift } from '../entities/hr/working-shift.entity';
import { CreateWorkingShiftDto } from './dto/create-working-shift.dto';
import { UpdateWorkingShiftDto } from './dto/update-working-shift.dto';
export declare class WorkingShiftsService {
    private workingShiftRepository;
    constructor(workingShiftRepository: Repository<WorkingShift>);
    create(createWorkingShiftDto: CreateWorkingShiftDto): Promise<WorkingShift>;
    findAll(page?: number, limit?: number, employeeId?: string, propertyId?: string, date?: string, shiftType?: string): Promise<{
        data: WorkingShift[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<WorkingShift>;
    update(id: string, updateWorkingShiftDto: UpdateWorkingShiftDto): Promise<WorkingShift>;
    remove(id: string): Promise<void>;
    findByEmployee(employeeId: string, page?: number, limit?: number): Promise<{
        data: WorkingShift[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByProperty(propertyId: string, page?: number, limit?: number): Promise<{
        data: WorkingShift[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByDateRange(startDate: string, endDate: string, page?: number, limit?: number): Promise<{
        data: WorkingShift[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
