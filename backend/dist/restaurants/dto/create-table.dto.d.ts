export declare enum TableStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    RESERVED = "reserved"
}
export declare class CreateTableDto {
    restaurantId: string;
    areaId?: string;
    tableNumber: string;
    capacity: number;
    location?: string;
    status?: TableStatus;
}
export declare class UpdateTableDto {
    areaId?: string;
    tableNumber?: string;
    capacity?: number;
    location?: string;
    status?: TableStatus;
}
