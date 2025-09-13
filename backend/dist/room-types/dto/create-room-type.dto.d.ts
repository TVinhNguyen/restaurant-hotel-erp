export declare class CreateRoomTypeDto {
    propertyId: string;
    name: string;
    description?: string;
    maxAdults?: number;
    maxChildren?: number;
    basePrice?: number;
    bedType?: string;
    amenityIds?: string[];
}
export declare class AddAmenityToRoomTypeDto {
    amenityId: string;
}
export declare class BulkAddAmenitiesToRoomTypeDto {
    amenityIds: string[];
}
export declare class RoomTypeQueryDto {
    propertyId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
