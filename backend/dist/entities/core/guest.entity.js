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
exports.Guest = void 0;
const typeorm_1 = require("typeorm");
const reservation_entity_1 = require("../reservation/reservation.entity");
const table_booking_entity_1 = require("../restaurant/table-booking.entity");
let Guest = class Guest {
    id;
    name;
    email;
    phone;
    loyaltyTier;
    passportId;
    consentMarketing;
    privacyVersion;
    createdAt;
    updatedAt;
    reservations;
    tableBookings;
};
exports.Guest = Guest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Guest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Guest.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Guest.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Guest.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'loyalty_tier', length: 50, nullable: true }),
    __metadata("design:type", String)
], Guest.prototype, "loyaltyTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passport_id', length: 50, nullable: true }),
    __metadata("design:type", String)
], Guest.prototype, "passportId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'consent_marketing', default: false }),
    __metadata("design:type", Boolean)
], Guest.prototype, "consentMarketing", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'privacy_version', length: 20, nullable: true }),
    __metadata("design:type", String)
], Guest.prototype, "privacyVersion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Guest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Guest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.guest),
    __metadata("design:type", Array)
], Guest.prototype, "reservations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => table_booking_entity_1.TableBooking, (tableBooking) => tableBooking.guest),
    __metadata("design:type", Array)
], Guest.prototype, "tableBookings", void 0);
exports.Guest = Guest = __decorate([
    (0, typeorm_1.Entity)({ schema: 'core', name: 'guests' })
], Guest);
//# sourceMappingURL=guest.entity.js.map