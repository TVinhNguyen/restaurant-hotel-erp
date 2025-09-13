import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation/reservation.entity';
import { Payment } from '../entities/reservation/payment.entity';
import { TableBooking } from '../entities/restaurant/table-booking.entity';
import { Room } from '../entities/inventory/room.entity';
import { ReportQueryDto, OccupancyReportDto, RevenueReportDto, RestaurantReportDto } from './dto/report-query.dto';
export declare class ReportsService {
    private reservationRepository;
    private paymentRepository;
    private tableBookingRepository;
    private roomRepository;
    constructor(reservationRepository: Repository<Reservation>, paymentRepository: Repository<Payment>, tableBookingRepository: Repository<TableBooking>, roomRepository: Repository<Room>);
    getDashboardSummary(queryDto: ReportQueryDto): Promise<{
        period: {
            startDate: ReportQueryDto;
            endDate: ReportQueryDto;
        };
        totalReservations: number;
        totalRevenue: number;
        occupancyRate: number;
        averageRevenue: number;
        statusBreakdown: {
            [key: string]: number;
        };
    }>;
    getOccupancyReport(queryDto: OccupancyReportDto): Promise<{
        period: {
            startDate: OccupancyReportDto;
            endDate: OccupancyReportDto;
        };
        totalRooms: number;
        occupiedRooms: number;
        occupancyRate: number;
        availableRooms: number;
        roomTypeBreakdown: {
            [key: string]: number;
        };
    }>;
    getRevenueReport(queryDto: RevenueReportDto): Promise<{
        period: {
            startDate: RevenueReportDto;
            endDate: RevenueReportDto;
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
    getRestaurantReport(queryDto: RestaurantReportDto): Promise<{
        period: {
            startDate: RestaurantReportDto;
            endDate: RestaurantReportDto;
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
    getPerformanceMetrics(queryDto: ReportQueryDto): Promise<{
        period: {
            startDate: ReportQueryDto;
            endDate: ReportQueryDto;
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
    private getTotalRevenue;
    private getOccupancyRate;
    private groupRevenueByDay;
}
