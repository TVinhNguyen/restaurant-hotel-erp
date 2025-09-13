export declare class CreatePaymentDto {
    reservationId: string;
    amount: number;
    currency: string;
    paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'online';
    transactionId?: string;
    gatewayResponse?: string;
}
