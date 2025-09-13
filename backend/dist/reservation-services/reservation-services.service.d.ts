import { Repository } from 'typeorm';
import { ReservationService } from '../entities/reservation/reservation-service.entity';
import { CreateReservationServiceDto } from './dto/create-reservation-service.dto';
import { UpdateReservationServiceDto } from './dto/update-reservation-service.dto';
export declare class ReservationServicesService {
    private reservationServiceRepository;
    constructor(reservationServiceRepository: Repository<ReservationService>);
    findAll(query: {
        page?: number;
        limit?: number;
        reservationId?: string;
        propertyServiceId?: string;
    }): Promise<{
        data: ReservationService[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<ReservationService>;
    create(createReservationServiceDto: CreateReservationServiceDto): Promise<ReservationService>;
    update(id: string, updateReservationServiceDto: UpdateReservationServiceDto): Promise<ReservationService>;
    remove(id: string): Promise<void>;
    findByReservation(reservationId: string): Promise<ReservationService[]>;
    getTotalServiceAmount(reservationId: string): Promise<number>;
    getServiceStatistics(propertyId?: string, startDate?: string, endDate?: string): Promise<any[]>;
}
