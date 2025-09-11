import { Property } from '../core/property.entity';
export declare class Promotion {
    id: string;
    propertyId: string;
    code: string;
    name: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    validFrom: Date;
    validTo: Date;
    isActive: boolean;
    property: Property;
}
