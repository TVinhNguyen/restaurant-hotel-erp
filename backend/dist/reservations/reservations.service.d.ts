import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
export declare class ReservationsService {
    private reservationRepository;
    constructor(reservationRepository: Repository<Reservation>);
    findAll(query: {
        page?: number;
        limit?: number;
        propertyId?: string;
        status?: string;
        checkInFrom?: string;
        checkInTo?: string;
        guestId?: string;
    }): Promise<{
        data: Reservation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<Reservation>;
    create(createReservationDto: CreateReservationDto): Promise<Reservation>;
    update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation>;
    checkIn(id: string, roomId?: string): Promise<Reservation>;
    checkOut(id: string): Promise<Reservation>;
    assignRoom(id: string, roomId: string): Promise<Reservation>;
    cancel(id: string): Promise<Reservation>;
    remove(id: string): Promise<void>;
    private generateConfirmationNumber;
}
