import { Reservation } from './reservation.entity';
import { PropertyService } from './property-service.entity';
export declare class ReservationService {
    id: string;
    reservationId: string;
    propertyServiceId: string;
    quantity: number;
    totalPrice: number;
    dateProvided: Date;
    reservation: Reservation;
    propertyService: PropertyService;
}
