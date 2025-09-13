import { Property } from '../core/property.entity';
import { RoomType } from '../inventory/room-type.entity';
import { DailyRate } from './daily-rate.entity';
import { Reservation } from './reservation.entity';
export declare class RatePlan {
    id: string;
    propertyId: string;
    roomTypeId: string;
    name: string;
    cancellationPolicy: string;
    currency: string;
    minStay: number;
    maxStay: number;
    isRefundable: boolean;
    property: Property;
    roomType: RoomType;
    dailyRates: DailyRate[];
    reservations: Reservation[];
}
