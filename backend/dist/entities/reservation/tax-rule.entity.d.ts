import { Property } from '../core/property.entity';
export declare class TaxRule {
    id: string;
    propertyId: string;
    taxName: string;
    taxRate: number;
    isInclusive: boolean;
    isActive: boolean;
    property: Property;
}
