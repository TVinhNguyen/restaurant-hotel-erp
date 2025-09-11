import { Repository } from 'typeorm';
import { RatePlan } from '../entities/reservation/rate-plan.entity';
import { DailyRate } from '../entities/reservation/daily-rate.entity';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';
export declare class RatePlansService {
    private ratePlanRepository;
    private dailyRateRepository;
    constructor(ratePlanRepository: Repository<RatePlan>, dailyRateRepository: Repository<DailyRate>);
    findAll(query: {
        page?: number;
        limit?: number;
        propertyId?: string;
        roomTypeId?: string;
    }): Promise<{
        data: RatePlan[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<RatePlan>;
    create(createRatePlanDto: CreateRatePlanDto): Promise<RatePlan>;
    update(id: string, updateRatePlanDto: UpdateRatePlanDto): Promise<RatePlan>;
    remove(id: string): Promise<void>;
    setDailyRate(ratePlanId: string, date: string, rate: number): Promise<DailyRate>;
    getDailyRates(ratePlanId: string, startDate?: string, endDate?: string): Promise<DailyRate[]>;
}
