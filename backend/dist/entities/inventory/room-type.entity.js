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
exports.RoomType = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../core/property.entity");
const room_type_amenity_entity_1 = require("./room-type-amenity.entity");
const photo_entity_1 = require("./photo.entity");
const room_entity_1 = require("./room.entity");
const rate_plan_entity_1 = require("../reservation/rate-plan.entity");
const reservation_entity_1 = require("../reservation/reservation.entity");
let RoomType = class RoomType {
    id;
    propertyId;
    name;
    description;
    maxAdults;
    maxChildren;
    basePrice;
    bedType;
    property;
    roomTypeAmenities;
    photos;
    rooms;
    ratePlans;
    reservations;
};
exports.RoomType = RoomType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoomType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid' }),
    __metadata("design:type", String)
], RoomType.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], RoomType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RoomType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_adults', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], RoomType.prototype, "maxAdults", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_children', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], RoomType.prototype, "maxChildren", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'base_price',
        type: 'decimal',
        precision: 12,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], RoomType.prototype, "basePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bed_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], RoomType.prototype, "bedType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.roomTypes),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], RoomType.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_type_amenity_entity_1.RoomTypeAmenity, (roomTypeAmenity) => roomTypeAmenity.roomType),
    __metadata("design:type", Array)
], RoomType.prototype, "roomTypeAmenities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => photo_entity_1.Photo, (photo) => photo.roomType),
    __metadata("design:type", Array)
], RoomType.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_entity_1.Room, (room) => room.roomType),
    __metadata("design:type", Array)
], RoomType.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rate_plan_entity_1.RatePlan, (ratePlan) => ratePlan.roomType),
    __metadata("design:type", Array)
], RoomType.prototype, "ratePlans", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.roomType),
    __metadata("design:type", Array)
], RoomType.prototype, "reservations", void 0);
exports.RoomType = RoomType = __decorate([
    (0, typeorm_1.Entity)({ schema: 'inventory', name: 'room_types' })
], RoomType);
//# sourceMappingURL=room-type.entity.js.map