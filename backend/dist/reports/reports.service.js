"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("../entities/reservation/reservation.entity");
const payment_entity_1 = require("../entities/reservation/payment.entity");
const table_booking_entity_1 = require("../entities/restaurant/table-booking.entity");
const room_entity_1 = require("../entities/core/room.entity");
let ReportsService = class ReportsService {
    reservationRepository;
    paymentRepository;
    tableBookingRepository;
    roomRepository;
    constructor(reservationRepository, paymentRepository, tableBookingRepository, roomRepository) {
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.tableBookingRepository = tableBookingRepository;
        this.roomRepository = roomRepository;
    }
    async getDashboardSummary(queryDto) {
        const { startDate, endDate, propertyId } = queryDto;
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
            statusBreakdown: reservations.reduce((acc, res) => {
                acc[res.status] = (acc[res.status] || 0) + 1;
                return acc;
            }, {}),
        };
    }
    async getOccupancyReport(queryDto) {
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
        const occupiedRooms = reservations.filter(res => res.status === 'checked_in').length;
        const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
        return {
            period: { startDate, endDate },
            totalRooms,
            occupiedRooms,
            occupancyRate: Number(occupancyRate.toFixed(2)),
            availableRooms: totalRooms - occupiedRooms,
            roomTypeBreakdown: reservations.reduce((acc, res) => {
                if (res.room) {
                    const roomType = res.room.roomTypeId || 'unknown';
                    acc[roomType] = (acc[roomType] || 0) + 1;
                }
                return acc;
            }, {}),
        };
    }
    async getRevenueReport(queryDto) {
        const { startDate, endDate, propertyId, roomTypeId } = queryDto;
        const paymentQuery = this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.reservation', 'reservation')
            .leftJoinAndSelect('reservation.room', 'room')
            .where('payment.paymentDate BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('payment.status = :status', { status: 'completed' });
        if (propertyId) {
            paymentQuery.andWhere('reservation.propertyId = :propertyId', { propertyId });
        }
        if (roomTypeId) {
            paymentQuery.andWhere('room.roomTypeId = :roomTypeId', { roomTypeId });
        }
        const payments = await paymentQuery.getMany();
        const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        const averageRevenue = payments.length > 0 ? totalRevenue / payments.length : 0;
        const revenueByMethod = payments.reduce((acc, payment) => {
            acc[payment.method] = (acc[payment.method] || 0) + Number(payment.amount);
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
    async getRestaurantReport(queryDto) {
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
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
        const noShowBookings = bookings.filter(b => b.status === 'no_show').length;
        return {
            period: { startDate, endDate },
            totalBookings,
            completedBookings,
            cancelledBookings,
            noShowBookings,
            completionRate: totalBookings > 0 ? Number(((completedBookings / totalBookings) * 100).toFixed(2)) : 0,
            statusBreakdown: bookings.reduce((acc, booking) => {
                acc[booking.status] = (acc[booking.status] || 0) + 1;
                return acc;
            }, {}),
            averagePartySize: totalBookings > 0 ?
                Number((bookings.reduce((sum, b) => sum + b.pax, 0) / totalBookings).toFixed(2)) : 0,
        };
    }
    async getPerformanceMetrics(queryDto) {
        const { startDate, endDate, propertyId } = queryDto;
        const [dashboardData, occupancyData, revenueData, restaurantData] = await Promise.all([
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
    async getTotalRevenue(startDate, endDate, propertyId) {
        const paymentQuery = this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoin('payment.reservation', 'reservation')
            .where('payment.paymentDate BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('payment.status = :status', { status: 'completed' });
        if (propertyId) {
            paymentQuery.andWhere('reservation.propertyId = :propertyId', { propertyId });
        }
        const payments = await paymentQuery.getMany();
        return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    }
    async getOccupancyRate(startDate, endDate, propertyId) {
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
    groupRevenueByDay(payments) {
        return payments.reduce((acc, payment) => {
            const date = payment.paymentDate.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + Number(payment.amount);
            return acc;
        }, {});
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, typeorm_1.InjectRepository)(table_booking_entity_1.TableBooking)),
    __param(3, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map