export declare class CreatePromotionDto {
    propertyId: string;
    code: string;
    name: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    validFrom?: string;
    validTo?: string;
    isActive?: boolean;
}
