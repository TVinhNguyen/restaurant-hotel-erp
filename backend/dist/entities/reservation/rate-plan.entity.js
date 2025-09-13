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
exports.RatePlan = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../core/property.entity");
const room_type_entity_1 = require("../inventory/room-type.entity");
const daily_rate_entity_1 = require("./daily-rate.entity");
const reservation_entity_1 = require("./reservation.entity");
let RatePlan = class RatePlan {
    id;
    propertyId;
    roomTypeId;
    name;
    cancellationPolicy;
    currency;
    minStay;
    maxStay;
    isRefundable;
    property;
    roomType;
    dailyRates;
    reservations;
};
exports.RatePlan = RatePlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RatePlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid' }),
    __metadata("design:type", String)
], RatePlan.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_type_id', type: 'uuid' }),
    __metadata("design:type", String)
], RatePlan.prototype, "roomTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], RatePlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancellation_policy', type: 'text', nullable: true }),
    __metadata("design:type", String)
], RatePlan.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], RatePlan.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_stay', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], RatePlan.prototype, "minStay", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_stay', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], RatePlan.prototype, "maxStay", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_refundable', default: true }),
    __metadata("design:type", Boolean)
], RatePlan.prototype, "isRefundable", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.ratePlans),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], RatePlan.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_type_entity_1.RoomType, (roomType) => roomType.ratePlans),
    (0, typeorm_1.JoinColumn)({ name: 'room_type_id' }),
    __metadata("design:type", room_type_entity_1.RoomType)
], RatePlan.prototype, "roomType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => daily_rate_entity_1.DailyRate, (dailyRate) => dailyRate.ratePlan),
    __metadata("design:type", Array)
], RatePlan.prototype, "dailyRates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.ratePlan),
    __metadata("design:type", Array)
], RatePlan.prototype, "reservations", void 0);
exports.RatePlan = RatePlan = __decorate([
    (0, typeorm_1.Entity)({ schema: 'reservation', name: 'rate_plans' })
], RatePlan);
//# sourceMappingURL=rate-plan.entity.js.map