export declare enum OperationalStatus {
    AVAILABLE = "available",
    OUT_OF_SERVICE = "out_of_service"
}
export declare enum HousekeepingStatus {
    CLEAN = "clean",
    DIRTY = "dirty",
    INSPECTED = "inspected"
}
export declare class CreateRoomDto {
    propertyId: string;
    roomTypeId: string;
    number: string;
    floor: string;
    viewType?: string;
    operationalStatus?: OperationalStatus;
    housekeepingStatus?: HousekeepingStatus;
    housekeeperNotes?: string;
}
export declare class UpdateRoomStatusDto {
    operationalStatus?: OperationalStatus;
    housekeepingStatus?: HousekeepingStatus;
    notes?: string;
    changedBy?: string;
}
export declare class RoomQueryDto {
    propertyId?: string;
    roomTypeId?: string;
    floor?: string;
    operationalStatus?: OperationalStatus;
    housekeepingStatus?: HousekeepingStatus;
    viewType?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class AvailableRoomsQueryDto {
    propertyId: string;
    roomTypeId?: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
    children?: number;
}
export declare class BulkUpdateRoomsStatusDto {
    roomIds: string[];
    operationalStatus?: OperationalStatus;
    housekeepingStatus?: HousekeepingStatus;
    notes?: string;
    changedBy: string;
}
export declare class ScheduleMaintenanceDto {
    maintenanceType: string;
    scheduledDate: string;
    estimatedDurationHours: number;
    notes?: string;
    assignedStaffId?: string;
}
export declare class HousekeepingReportQueryDto {
    propertyId: string;
    floor?: string;
    date?: string;
}
export declare class OccupancyForecastQueryDto {
    propertyId: string;
    dateFrom?: string;
    dateTo?: string;
    roomTypeId?: string;
}
