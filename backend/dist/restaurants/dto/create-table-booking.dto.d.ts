export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    SEATED = "seated",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show"
}
export declare class CreateTableBookingDto {
    restaurantId: string;
    tableId?: string;
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    bookingDate: string;
    bookingTime: string;
    partySize: number;
    specialRequests?: string;
    status?: BookingStatus;
}
export declare class UpdateTableBookingDto {
    tableId?: string;
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    bookingDate?: string;
    bookingTime?: string;
    partySize?: number;
    specialRequests?: string;
    status?: BookingStatus;
}
