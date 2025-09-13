import { Repository } from 'typeorm';
import { DailyRate } from '../entities/reservation/daily-rate.entity';
import { CreateDailyRateDto } from './dto/create-daily-rate.dto';
import { UpdateDailyRateDto } from './dto/update-daily-rate.dto';
export declare class DailyRatesService {
    private dailyRateRepository;
    constructor(dailyRateRepository: Repository<DailyRate>);
    findAll(query: {
        page?: number;
        limit?: number;
        ratePlanId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        data: DailyRate[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<DailyRate>;
    create(createDailyRateDto: CreateDailyRateDto): Promise<DailyRate>;
    update(id: string, updateDailyRateDto: UpdateDailyRateDto): Promise<DailyRate>;
    remove(id: string): Promise<void>;
    findByRatePlanAndDateRange(ratePlanId: string, startDate: string, endDate: string): Promise<DailyRate[]>;
}
