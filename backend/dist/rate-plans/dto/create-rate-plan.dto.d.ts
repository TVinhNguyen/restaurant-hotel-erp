export declare class CreateRatePlanDto {
    propertyId: string;
    roomTypeId: string;
    name: string;
    cancellationPolicy?: string;
    currency: string;
    minStay?: number;
    maxStay?: number;
    isRefundable?: boolean;
}
