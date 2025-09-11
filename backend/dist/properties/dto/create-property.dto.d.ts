export declare class CreatePropertyDto {
    name: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
    email?: string;
    website?: string;
    propertyType?: 'Hotel' | 'Resort' | 'Restaurant Chain';
    checkInTime?: string;
    checkOutTime?: string;
}
