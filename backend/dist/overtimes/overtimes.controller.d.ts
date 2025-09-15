import { OvertimesService } from './overtimes.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
export declare class OvertimesController {
    private readonly overtimesService;
    constructor(overtimesService: OvertimesService);
    create(createOvertimeDto: CreateOvertimeDto): Promise<import("../entities").Overtime>;
    findAll(page?: string, limit?: string, employeeId?: string, workingShiftId?: string, approvedBy?: string): Promise<{
        data: import("../entities").Overtime[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByEmployee(employeeId: string, page?: string, limit?: string): Promise<{
        data: import("../entities").Overtime[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByWorkingShift(workingShiftId: string, page?: string, limit?: string): Promise<{
        data: import("../entities").Overtime[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByApprover(approvedBy: string, page?: string, limit?: string): Promise<{
        data: import("../entities").Overtime[];
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
    calculateOvertimeAmount(body: {
        numberOfHours: number;
        rate: number;
    }): Promise<{
        numberOfHours: number;
        rate: number;
        amount: number;
    }>;
    findOne(id: string): Promise<import("../entities").Overtime>;
    update(id: string, updateOvertimeDto: UpdateOvertimeDto): Promise<import("../entities").Overtime>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
