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
exports.ReservationServicesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const reservation_services_service_1 = require("./reservation-services.service");
const create_reservation_service_dto_1 = require("./dto/create-reservation-service.dto");
const update_reservation_service_dto_1 = require("./dto/update-reservation-service.dto");
let ReservationServicesController = class ReservationServicesController {
    reservationServicesService;
    constructor(reservationServicesService) {
        this.reservationServicesService = reservationServicesService;
    }
    async findAll(page, limit, reservationId, propertyServiceId) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return await this.reservationServicesService.findAll({
            page: pageNum,
            limit: limitNum,
            reservationId,
            propertyServiceId,
        });
    }
    async findOne(id) {
        return await this.reservationServicesService.findOne(id);
    }
    async create(createReservationServiceDto) {
        return await this.reservationServicesService.create(createReservationServiceDto);
    }
    async update(id, updateReservationServiceDto) {
        return await this.reservationServicesService.update(id, updateReservationServiceDto);
    }
    async remove(id) {
        await this.reservationServicesService.remove(id);
        return { message: 'Reservation service deleted successfully' };
    }
    async findByReservation(reservationId) {
        return await this.reservationServicesService.findByReservation(reservationId);
    }
    async getTotalServiceAmount(reservationId) {
        const total = await this.reservationServicesService.getTotalServiceAmount(reservationId);
        return { reservationId, totalServiceAmount: total };
    }
    async getServiceStatistics(propertyId, startDate, endDate) {
        return await this.reservationServicesService.getServiceStatistics(propertyId, startDate, endDate);
    }
};
exports.ReservationServicesController = ReservationServicesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('reservationId')),
    __param(3, (0, common_1.Query)('propertyServiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReservationServicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationServicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_service_dto_1.CreateReservationServiceDto]),
    __metadata("design:returntype", Promise)
], ReservationServicesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reservation_service_dto_1.UpdateReservationServiceDto]),
    __metadata("design:returntype", Promise)
], ReservationServicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationServicesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('reservation/:reservationId'),
    __param(0, (0, common_1.Param)('reservationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationServicesController.prototype, "findByReservation", null);
__decorate([
    (0, common_1.Get)('reservation/:reservationId/total'),
    __param(0, (0, common_1.Param)('reservationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationServicesController.prototype, "getTotalServiceAmount", null);
__decorate([
    (0, common_1.Get)('statistics/services'),
    __param(0, (0, common_1.Query)('propertyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReservationServicesController.prototype, "getServiceStatistics", null);
exports.ReservationServicesController = ReservationServicesController = __decorate([
    (0, common_1.Controller)('reservation-services'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [reservation_services_service_1.ReservationServicesService])
], ReservationServicesController);
//# sourceMappingURL=reservation-services.controller.js.map