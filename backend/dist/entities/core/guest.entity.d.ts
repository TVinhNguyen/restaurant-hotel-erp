import { Reservation } from '../reservation/reservation.entity';
import { TableBooking } from '../restaurant/table-booking.entity';
export declare class Guest {
    id: string;
    name: string;
    email: string;
    phone: string;
    loyaltyTier: string;
    passportId: string;
    consentMarketing: boolean;
    privacyVersion: string;
    createdAt: Date;
    updatedAt: Date;
    reservations: Reservation[];
    tableBookings: TableBooking[];
}
