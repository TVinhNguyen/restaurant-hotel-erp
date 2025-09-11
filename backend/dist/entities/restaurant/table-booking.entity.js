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
exports.TableBooking = void 0;
const typeorm_1 = require("typeorm");
const restaurant_entity_1 = require("./restaurant.entity");
const guest_entity_1 = require("../core/guest.entity");
const reservation_entity_1 = require("../reservation/reservation.entity");
const restaurant_table_entity_1 = require("./restaurant-table.entity");
let TableBooking = class TableBooking {
    id;
    restaurantId;
    guestId;
    reservationId;
    bookingDate;
    bookingTime;
    pax;
    status;
    assignedTableId;
    specialRequests;
    durationMinutes;
    createdAt;
    restaurant;
    guest;
    reservation;
    assignedTable;
};
exports.TableBooking = TableBooking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TableBooking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'restaurant_id', type: 'uuid' }),
    __metadata("design:type", String)
], TableBooking.prototype, "restaurantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guest_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], TableBooking.prototype, "guestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reservation_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], TableBooking.prototype, "reservationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_date', type: 'date' }),
    __metadata("design:type", Date)
], TableBooking.prototype, "bookingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_time', type: 'time' }),
    __metadata("design:type", String)
], TableBooking.prototype, "bookingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TableBooking.prototype, "pax", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, default: 'pending' }),
    __metadata("design:type", String)
], TableBooking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_table_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], TableBooking.prototype, "assignedTableId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_requests', type: 'text', nullable: true }),
    __metadata("design:type", String)
], TableBooking.prototype, "specialRequests", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_minutes', type: 'int', default: 90 }),
    __metadata("design:type", Number)
], TableBooking.prototype, "durationMinutes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TableBooking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_entity_1.Restaurant),
    (0, typeorm_1.JoinColumn)({ name: 'restaurant_id' }),
    __metadata("design:type", restaurant_entity_1.Restaurant)
], TableBooking.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guest_entity_1.Guest, (guest) => guest.tableBookings, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'guest_id' }),
    __metadata("design:type", guest_entity_1.Guest)
], TableBooking.prototype, "guest", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reservation_entity_1.Reservation, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reservation_id' }),
    __metadata("design:type", reservation_entity_1.Reservation)
], TableBooking.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_table_entity_1.RestaurantTable, (table) => table.bookings, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_table_id' }),
    __metadata("design:type", restaurant_table_entity_1.RestaurantTable)
], TableBooking.prototype, "assignedTable", void 0);
exports.TableBooking = TableBooking = __decorate([
    (0, typeorm_1.Entity)({ schema: 'restaurant', name: 'table_bookings' })
], TableBooking);
//# sourceMappingURL=table-booking.entity.js.map