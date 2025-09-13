export declare enum AmenityCategory {
    ROOM = "room",
    FACILITY = "facility"
}
export declare class CreateAmenityDto {
    name: string;
    category: AmenityCategory;
}
export declare class UpdateAmenityDto {
    name?: string;
    category?: AmenityCategory;
}
export declare class AmenityQueryDto {
    category?: AmenityCategory;
    search?: string;
    page?: number;
    limit?: number;
}
