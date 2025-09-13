import { Property } from '../core/property.entity';
import { Service } from './service.entity';
import { ReservationService } from './reservation-service.entity';
export declare class PropertyService {
    id: string;
    propertyId: string;
    serviceId: string;
    price: number;
    currency: string;
    isActive: boolean;
    property: Property;
    service: Service;
    reservationServices: ReservationService[];
}
