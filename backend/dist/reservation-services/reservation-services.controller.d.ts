import { ReservationServicesService } from './reservation-services.service';
import { CreateReservationServiceDto } from './dto/create-reservation-service.dto';
import { UpdateReservationServiceDto } from './dto/update-reservation-service.dto';
export declare class ReservationServicesController {
    private readonly reservationServicesService;
    constructor(reservationServicesService: ReservationServicesService);
    findAll(page?: string, limit?: string, reservationId?: string, propertyServiceId?: string): Promise<{
        data: import("../entities/reservation/reservation-service.entity").ReservationService[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities/reservation/reservation-service.entity").ReservationService>;
    create(createReservationServiceDto: CreateReservationServiceDto): Promise<import("../entities/reservation/reservation-service.entity").ReservationService>;
    update(id: string, updateReservationServiceDto: UpdateReservationServiceDto): Promise<import("../entities/reservation/reservation-service.entity").ReservationService>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByReservation(reservationId: string): Promise<import("../entities/reservation/reservation-service.entity").ReservationService[]>;
    getTotalServiceAmount(reservationId: string): Promise<{
        reservationId: string;
        totalServiceAmount: number;
    }>;
    getServiceStatistics(propertyId?: string, startDate?: string, endDate?: string): Promise<any[]>;
}
