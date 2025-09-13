import { DailyRatesService } from './daily-rates.service';
import { CreateDailyRateDto } from './dto/create-daily-rate.dto';
import { UpdateDailyRateDto } from './dto/update-daily-rate.dto';
export declare class DailyRatesController {
    private readonly dailyRatesService;
    constructor(dailyRatesService: DailyRatesService);
    findAll(page?: string, limit?: string, ratePlanId?: string, startDate?: string, endDate?: string): Promise<{
        data: import("../entities").DailyRate[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").DailyRate>;
    create(createDailyRateDto: CreateDailyRateDto): Promise<import("../entities").DailyRate>;
    update(id: string, updateDailyRateDto: UpdateDailyRateDto): Promise<import("../entities").DailyRate>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByRatePlan(ratePlanId: string, startDate?: string, endDate?: string): Promise<import("../entities").DailyRate[]>;
}
