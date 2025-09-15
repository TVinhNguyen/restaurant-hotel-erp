import { WorkingShiftsService } from './working-shifts.service';
import { CreateWorkingShiftDto } from './dto/create-working-shift.dto';
import { UpdateWorkingShiftDto } from './dto/update-working-shift.dto';
export declare class WorkingShiftsController {
    private readonly workingShiftsService;
    constructor(workingShiftsService: WorkingShiftsService);
    create(createWorkingShiftDto: CreateWorkingShiftDto): Promise<import("../entities").WorkingShift>;
    findAll(page?: string, limit?: string, employeeId?: string, propertyId?: string, date?: string, shiftType?: string): Promise<{
        data: import("../entities").WorkingShift[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByEmployee(employeeId: string, page?: string, limit?: string): Promise<{
        data: import("../entities").WorkingShift[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByProperty(propertyId: string, page?: string, limit?: string): Promise<{
        data: import("../entities").WorkingShift[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByDateRange(startDate: string, endDate: string, page?: string, limit?: string): Promise<{
        data: import("../entities").WorkingShift[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../entities").WorkingShift>;
    update(id: string, updateWorkingShiftDto: UpdateWorkingShiftDto): Promise<import("../entities").WorkingShift>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
