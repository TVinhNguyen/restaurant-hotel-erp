export declare class CreateReservationDto {
    propertyId: string;
    guestId: string;
    roomTypeId: string;
    ratePlanId: string;
    assignedRoomId?: string;
    externalReference?: string;
    bookingChannel: 'OTA' | 'website' | 'walk-in' | 'phone';
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children?: number;
    roomRate: number;
    totalAmount: number;
    taxAmount?: number;
    serviceCharge?: number;
    currency: string;
    specialRequests?: string;
}
