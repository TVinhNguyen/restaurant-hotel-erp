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
exports.Property = void 0;
const typeorm_1 = require("typeorm");
const room_type_entity_1 = require("../inventory/room-type.entity");
const room_entity_1 = require("../inventory/room.entity");
const rate_plan_entity_1 = require("../reservation/rate-plan.entity");
const property_service_entity_1 = require("../reservation/property-service.entity");
const promotion_entity_1 = require("../reservation/promotion.entity");
const tax_rule_entity_1 = require("../reservation/tax-rule.entity");
const reservation_entity_1 = require("../reservation/reservation.entity");
const restaurant_entity_1 = require("../restaurant/restaurant.entity");
const working_shift_entity_1 = require("../hr/working-shift.entity");
let Property = class Property {
    id;
    name;
    address;
    city;
    country;
    phone;
    email;
    website;
    propertyType;
    checkInTime;
    checkOutTime;
    roomTypes;
    rooms;
    ratePlans;
    propertyServices;
    promotions;
    taxRules;
    reservations;
    restaurants;
    workingShifts;
};
exports.Property = Property;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Property.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Property.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "propertyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "checkInTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_out_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "checkOutTime", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_type_entity_1.RoomType, (roomType) => roomType.property),
    __metadata("design:type", Array)
], Property.prototype, "roomTypes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_entity_1.Room, (room) => room.property),
    __metadata("design:type", Array)
], Property.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rate_plan_entity_1.RatePlan, (ratePlan) => ratePlan.property),
    __metadata("design:type", Array)
], Property.prototype, "ratePlans", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_service_entity_1.PropertyService, (propertyService) => propertyService.property),
    __metadata("design:type", Array)
], Property.prototype, "propertyServices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => promotion_entity_1.Promotion, (promotion) => promotion.property),
    __metadata("design:type", Array)
], Property.prototype, "promotions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tax_rule_entity_1.TaxRule, (taxRule) => taxRule.property),
    __metadata("design:type", Array)
], Property.prototype, "taxRules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.property),
    __metadata("design:type", Array)
], Property.prototype, "reservations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => restaurant_entity_1.Restaurant, (restaurant) => restaurant.property),
    __metadata("design:type", Array)
], Property.prototype, "restaurants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => working_shift_entity_1.WorkingShift, (workingShift) => workingShift.property),
    __metadata("design:type", Array)
], Property.prototype, "workingShifts", void 0);
exports.Property = Property = __decorate([
    (0, typeorm_1.Entity)({ schema: 'core', name: 'properties' })
], Property);
//# sourceMappingURL=property.entity.js.map