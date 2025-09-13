import { RatePlan } from './rate-plan.entity';
export declare class DailyRate {
    id: string;
    ratePlanId: string;
    date: Date;
    price: number;
    availableRooms: number;
    stopSell: boolean;
    ratePlan: RatePlan;
}
