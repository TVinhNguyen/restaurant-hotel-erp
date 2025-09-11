export declare enum ReportPeriod {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    CUSTOM = "custom"
}
export declare class ReportQueryDto {
    propertyId?: string;
    startDate: string;
    endDate: string;
    period?: ReportPeriod;
}
export declare class OccupancyReportDto extends ReportQueryDto {
}
export declare class RevenueReportDto extends ReportQueryDto {
    roomTypeId?: string;
}
export declare class RestaurantReportDto extends ReportQueryDto {
    restaurantId?: string;
}
