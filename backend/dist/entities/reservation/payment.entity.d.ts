import { Reservation } from './reservation.entity';
export declare class Payment {
    id: string;
    reservationId: string;
    amount: number;
    currency: string;
    paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'online';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId: string;
    gatewayResponse: string;
    paidAt: Date;
    reservation: Reservation;
}
