import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboardSummary(startDate: string, endDate: string, propertyId?: string): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        totalReservations: number;
        totalRevenue: number;
        occupancyRate: number;
        averageRevenue: number;
        statusBreakdown: {
            [key: string]: number;
        };
    }>;
    getOccupancyReport(startDate: string, endDate: string, propertyId?: string): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        totalRooms: number;
        occupiedRooms: number;
        occupancyRate: number;
        availableRooms: number;
        roomTypeBreakdown: {
            [key: string]: number;
        };
    }>;
    getRevenueReport(startDate: string, endDate: string, propertyId?: string, roomTypeId?: string): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        totalRevenue: number;
        averageRevenue: number;
        totalTransactions: number;
        revenueByPaymentMethod: {
            [key: string]: number;
        };
        dailyRevenue: {
            [date: string]: number;
        };
    }>;
    getRestaurantReport(startDate: string, endDate: string, propertyId?: string, restaurantId?: string): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        totalBookings: number;
        completedBookings: number;
        cancelledBookings: number;
        noShowBookings: number;
        completionRate: number;
        statusBreakdown: {
            [key: string]: number;
        };
        averagePartySize: number;
    }>;
    getPerformanceMetrics(startDate: string, endDate: string, propertyId?: string): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        hotel: {
            totalReservations: number;
            occupancyRate: number;
            totalRevenue: number;
            averageRevenue: number;
        };
        restaurant: {
            totalBookings: number;
            completionRate: number;
            averagePartySize: number;
        };
        summary: {
            totalGuests: number;
            combinedRevenue: number;
            propertyUtilization: number;
        };
    }>;
}
