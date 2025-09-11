import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    findAll(page?: string, limit?: string, propertyId?: string, status?: string, checkInFrom?: string, checkInTo?: string, guestId?: string): Promise<{
        data: import("../entities").Reservation[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").Reservation>;
    create(createReservationDto: CreateReservationDto): Promise<import("../entities").Reservation>;
    update(id: string, updateReservationDto: UpdateReservationDto): Promise<import("../entities").Reservation>;
    checkIn(id: string, body: {
        roomId?: string;
    }): Promise<import("../entities").Reservation>;
    checkOut(id: string): Promise<import("../entities").Reservation>;
    assignRoom(id: string, body: {
        roomId: string;
    }): Promise<import("../entities").Reservation>;
    cancel(id: string): Promise<import("../entities").Reservation>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
