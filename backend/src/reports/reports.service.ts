import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from '../entities/reservation/reservation.entity';
import { Payment } from '../entities/reservation/payment.entity';
import { TableBooking } from '../entities/restaurant/table-booking.entity';
import { Room } from '../entities/inventory/room.entity';
import { ReportQueryDto, OccupancyReportDto, RevenueReportDto, RestaurantReportDto } from './dto/report-query.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(TableBooking)
    private tableBookingRepository: Repository<TableBooking>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async getDashboardSummary(queryDto: ReportQueryDto) {
    const { startDate, endDate, propertyId } = queryDto;

    // Get reservation stats
    const reservationQuery = this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.checkInDate BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (propertyId) {
      reservationQuery.andWhere('reservation.propertyId = :propertyId', { propertyId });
    }

    const reservations = await reservationQuery.getMany();
    const totalRevenue = await this.getTotalRevenue(startDate, endDate, propertyId);
    const occupancyRate = await this.getOccupancyRate(startDate, endDate, propertyId);

    return {
      period: { startDate, endDate },
      totalReservations: reservations.length,
      totalRevenue,
      occupancyRate,
      averageRevenue: reservations.length > 0 ? totalRevenue / reservations.length : 0,
      statusBreakdown: reservations.reduce((acc: { [key: string]: number }, res: any) => {
        acc[res.status] = (acc[res.status] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  async getOccupancyReport(queryDto: OccupancyReportDto) {
    const { startDate, endDate, propertyId } = queryDto;

    const reservationQuery = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.room', 'room')
      .where('reservation.checkInDate BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (propertyId) {
      reservationQuery.andWhere('reservation.propertyId = :propertyId', { propertyId });
    }

    const reservations = await reservationQuery.getMany();
    const totalRoomsQuery = this.roomRepository.createQueryBuilder('room');
    
    if (propertyId) {
      totalRoomsQuery.where('room.propertyId = :propertyId', { propertyId });
    }

    const totalRooms = await totalRoomsQuery.getCount();
    const occupiedRooms = reservations.filter((res: any) => res.status === 'checked_in').length;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    return {
      period: { startDate, endDate },
      totalRooms,
      occupiedRooms,
      occupancyRate: Number(occupancyRate.toFixed(2)),
      availableRooms: totalRooms - occupiedRooms,
      roomTypeBreakdown: reservations.reduce((acc: { [key: string]: number }, res: any) => {
        if (res.assignedRoom) {
          const roomType = res.assignedRoom.roomTypeId || 'unknown';
          acc[roomType] = (acc[roomType] || 0) + 1;
        }
        return acc;
      }, {}),
    };
  }

  async getRevenueReport(queryDto: RevenueReportDto) {
    const { startDate, endDate, propertyId, roomTypeId } = queryDto;

    const paymentQuery = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.reservation', 'reservation')
      .leftJoinAndSelect('reservation.room', 'room')
      .where('payment.paidAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('payment.paymentStatus = :status', { status: 'completed' });

    if (propertyId) {
      paymentQuery.andWhere('reservation.propertyId = :propertyId', { propertyId });
    }

    if (roomTypeId) {
      paymentQuery.andWhere('room.roomTypeId = :roomTypeId', { roomTypeId });
    }

    const payments = await paymentQuery.getMany();
    
    const totalRevenue = payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0);
    const averageRevenue = payments.length > 0 ? totalRevenue / payments.length : 0;

    const revenueByMethod = payments.reduce((acc: { [key: string]: number }, payment: any) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + Number(payment.amount);
      return acc;
    }, {});

    return {
      period: { startDate, endDate },
      totalRevenue,
      averageRevenue: Number(averageRevenue.toFixed(2)),
      totalTransactions: payments.length,
      revenueByPaymentMethod: revenueByMethod,
      dailyRevenue: this.groupRevenueByDay(payments),
    };
  }

  async getRestaurantReport(queryDto: RestaurantReportDto) {
    const { startDate, endDate, propertyId, restaurantId } = queryDto;

    const bookingQuery = this.tableBookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.restaurant', 'restaurant')
      .where('booking.bookingDate BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (propertyId) {
      bookingQuery.andWhere('restaurant.propertyId = :propertyId', { propertyId });
    }

    if (restaurantId) {
      bookingQuery.andWhere('booking.restaurantId = :restaurantId', { restaurantId });
    }

    const bookings = await bookingQuery.getMany();

    const totalBookings = bookings.length;
    const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;
    const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled').length;
    const noShowBookings = bookings.filter((b: any) => b.status === 'no_show').length;

    return {
      period: { startDate, endDate },
      totalBookings,
      completedBookings,
      cancelledBookings,
      noShowBookings,
      completionRate: totalBookings > 0 ? Number(((completedBookings / totalBookings) * 100).toFixed(2)) : 0,
      statusBreakdown: bookings.reduce((acc: { [key: string]: number }, booking: any) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {}),
      averagePartySize: totalBookings > 0 ? 
        Number((bookings.reduce((sum: number, b: any) => sum + b.pax, 0) / totalBookings).toFixed(2)) : 0,
    };
  }

  async getPerformanceMetrics(queryDto: ReportQueryDto) {
    const { startDate, endDate, propertyId } = queryDto;

    const [
      dashboardData,
      occupancyData,
      revenueData,
      restaurantData
    ] = await Promise.all([
      this.getDashboardSummary(queryDto),
      this.getOccupancyReport(queryDto),
      this.getRevenueReport(queryDto),
      this.getRestaurantReport(queryDto)
    ]);

    return {
      period: { startDate, endDate },
      hotel: {
        totalReservations: dashboardData.totalReservations,
        occupancyRate: occupancyData.occupancyRate,
        totalRevenue: revenueData.totalRevenue,
        averageRevenue: revenueData.averageRevenue,
      },
      restaurant: {
        totalBookings: restaurantData.totalBookings,
        completionRate: restaurantData.completionRate,
        averagePartySize: restaurantData.averagePartySize,
      },
      summary: {
        totalGuests: dashboardData.totalReservations + restaurantData.totalBookings,
        combinedRevenue: revenueData.totalRevenue,
        propertyUtilization: (occupancyData.occupancyRate + restaurantData.completionRate) / 2,
      }
    };
  }

  private async getTotalRevenue(startDate: string, endDate: string, propertyId?: string): Promise<number> {
    const paymentQuery = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.reservation', 'reservation')
      .where('payment.paidAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('payment.paymentStatus = :status', { status: 'completed' });

    if (propertyId) {
      paymentQuery.andWhere('reservation.propertyId = :propertyId', { propertyId });
    }

    const payments = await paymentQuery.getMany();
    return payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0);
  }

  private async getOccupancyRate(startDate: string, endDate: string, propertyId?: string): Promise<number> {
    const reservationQuery = this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.checkInDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('reservation.status = :status', { status: 'checked_in' });

    if (propertyId) {
      reservationQuery.andWhere('reservation.propertyId = :propertyId', { propertyId });
    }

    const occupiedRooms = await reservationQuery.getCount();
    
    const totalRoomsQuery = this.roomRepository.createQueryBuilder('room');
    if (propertyId) {
      totalRoomsQuery.where('room.propertyId = :propertyId', { propertyId });
    }
    
    const totalRooms = await totalRoomsQuery.getCount();
    
    return totalRooms > 0 ? Number(((occupiedRooms / totalRooms) * 100).toFixed(2)) : 0;
  }

  private groupRevenueByDay(payments: Payment[]): { [date: string]: number } {
    return payments.reduce((acc: { [date: string]: number }, payment) => {
      const date = payment.paidAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + Number(payment.amount);
      return acc;
    }, {});
  }
}