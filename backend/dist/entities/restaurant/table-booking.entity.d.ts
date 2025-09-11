import { Restaurant } from './restaurant.entity';
import { Guest } from '../core/guest.entity';
import { Reservation } from '../reservation/reservation.entity';
import { RestaurantTable } from './restaurant-table.entity';
export declare class TableBooking {
    id: string;
    restaurantId: string;
    guestId: string;
    reservationId: string;
    bookingDate: Date;
    bookingTime: string;
    pax: number;
    status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'no_show' | 'cancelled';
    assignedTableId: string;
    specialRequests: string;
    durationMinutes: number;
    createdAt: Date;
    restaurant: Restaurant;
    guest: Guest;
    reservation: Reservation;
    assignedTable: RestaurantTable;
}
