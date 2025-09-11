import { RatePlansService } from './rate-plans.service';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';
export declare class RatePlansController {
    private readonly ratePlansService;
    constructor(ratePlansService: RatePlansService);
    findAll(page?: string, limit?: string, propertyId?: string, roomTypeId?: string): Promise<{
        data: import("../entities").RatePlan[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").RatePlan>;
    create(createRatePlanDto: CreateRatePlanDto): Promise<import("../entities").RatePlan>;
    update(id: string, updateRatePlanDto: UpdateRatePlanDto): Promise<import("../entities").RatePlan>;
    remove(id: string): Promise<{
        message: string;
    }>;
    setDailyRate(ratePlanId: string, body: {
        date: string;
        rate: number;
    }): Promise<import("../entities").DailyRate>;
    getDailyRates(ratePlanId: string, startDate?: string, endDate?: string): Promise<import("../entities").DailyRate[]>;
}
