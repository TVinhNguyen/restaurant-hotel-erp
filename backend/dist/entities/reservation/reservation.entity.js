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
exports.Reservation = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../core/property.entity");
const guest_entity_1 = require("../core/guest.entity");
const room_type_entity_1 = require("../inventory/room-type.entity");
const room_entity_1 = require("../inventory/room.entity");
const rate_plan_entity_1 = require("./rate-plan.entity");
const payment_entity_1 = require("./payment.entity");
const reservation_service_entity_1 = require("./reservation-service.entity");
let Reservation = class Reservation {
    id;
    propertyId;
    guestId;
    roomTypeId;
    assignedRoomId;
    ratePlanId;
    confirmationNumber;
    externalReference;
    bookingChannel;
    checkInDate;
    checkOutDate;
    adults;
    children;
    roomRate;
    totalAmount;
    taxAmount;
    serviceCharge;
    currency;
    status;
    specialRequests;
    createdAt;
    updatedAt;
    property;
    guest;
    roomType;
    assignedRoom;
    ratePlan;
    payments;
    reservationServices;
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid' }),
    __metadata("design:type", String)
], Reservation.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guest_id', type: 'uuid' }),
    __metadata("design:type", String)
], Reservation.prototype, "guestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_type_id', type: 'uuid' }),
    __metadata("design:type", String)
], Reservation.prototype, "roomTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_room_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "assignedRoomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate_plan_id', type: 'uuid' }),
    __metadata("design:type", String)
], Reservation.prototype, "ratePlanId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmation_number', length: 50, unique: true }),
    __metadata("design:type", String)
], Reservation.prototype, "confirmationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'external_reference', length: 100, nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "externalReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_channel', length: 50 }),
    __metadata("design:type", String)
], Reservation.prototype, "bookingChannel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_date', type: 'date' }),
    __metadata("design:type", Date)
], Reservation.prototype, "checkInDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_out_date', type: 'date' }),
    __metadata("design:type", Date)
], Reservation.prototype, "checkOutDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Reservation.prototype, "adults", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Reservation.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_rate', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Reservation.prototype, "roomRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Reservation.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 12,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Reservation.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'service_charge',
        type: 'decimal',
        precision: 12,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Reservation.prototype, "serviceCharge", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], Reservation.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'confirmed' }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_requests', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "specialRequests", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Reservation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Reservation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.reservations),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], Reservation.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guest_entity_1.Guest, (guest) => guest.reservations),
    (0, typeorm_1.JoinColumn)({ name: 'guest_id' }),
    __metadata("design:type", guest_entity_1.Guest)
], Reservation.prototype, "guest", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_type_entity_1.RoomType, (roomType) => roomType.reservations),
    (0, typeorm_1.JoinColumn)({ name: 'room_type_id' }),
    __metadata("design:type", room_type_entity_1.RoomType)
], Reservation.prototype, "roomType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.reservations, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_room_id' }),
    __metadata("design:type", room_entity_1.Room)
], Reservation.prototype, "assignedRoom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rate_plan_entity_1.RatePlan, (ratePlan) => ratePlan.reservations),
    (0, typeorm_1.JoinColumn)({ name: 'rate_plan_id' }),
    __metadata("design:type", rate_plan_entity_1.RatePlan)
], Reservation.prototype, "ratePlan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.reservation),
    __metadata("design:type", Array)
], Reservation.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_service_entity_1.ReservationService, (reservationService) => reservationService.reservation),
    __metadata("design:type", Array)
], Reservation.prototype, "reservationServices", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)({ schema: 'reservation', name: 'reservations' })
], Reservation);
//# sourceMappingURL=reservation.entity.js.map