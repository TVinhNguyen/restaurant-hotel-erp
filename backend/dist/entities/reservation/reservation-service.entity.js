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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const typeorm_1 = require("typeorm");
const reservation_entity_1 = require("./reservation.entity");
const property_service_entity_1 = require("./property-service.entity");
let ReservationService = class ReservationService {
    id;
    reservationId;
    propertyServiceId;
    quantity;
    totalPrice;
    dateProvided;
    reservation;
    propertyService;
};
exports.ReservationService = ReservationService;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReservationService.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reservation_id', type: 'uuid' }),
    __metadata("design:type", String)
], ReservationService.prototype, "reservationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_service_id', type: 'uuid' }),
    __metadata("design:type", String)
], ReservationService.prototype, "propertyServiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", Number)
], ReservationService.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_price', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], ReservationService.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_provided', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ReservationService.prototype, "dateProvided", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reservation_entity_1.Reservation, (reservation) => reservation.reservationServices),
    (0, typeorm_1.JoinColumn)({ name: 'reservation_id' }),
    __metadata("design:type", reservation_entity_1.Reservation)
], ReservationService.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_service_entity_1.PropertyService, (propertyService) => propertyService.reservationServices),
    (0, typeorm_1.JoinColumn)({ name: 'property_service_id' }),
    __metadata("design:type", property_service_entity_1.PropertyService)
], ReservationService.prototype, "propertyService", void 0);
exports.ReservationService = ReservationService = __decorate([
    (0, typeorm_1.Entity)({ schema: 'reservation', name: 'reservation_services' })
], ReservationService);
//# sourceMappingURL=reservation-service.entity.js.map