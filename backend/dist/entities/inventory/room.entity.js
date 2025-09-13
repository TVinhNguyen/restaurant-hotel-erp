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
exports.Room = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../core/property.entity");
const room_type_entity_1 = require("./room-type.entity");
const room_status_history_entity_1 = require("./room-status-history.entity");
const reservation_entity_1 = require("../reservation/reservation.entity");
let Room = class Room {
    id;
    propertyId;
    roomTypeId;
    number;
    floor;
    viewType;
    operationalStatus;
    housekeepingStatus;
    housekeeperNotes;
    property;
    roomType;
    statusHistory;
    reservations;
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid' }),
    __metadata("design:type", String)
], Room.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_type_id', type: 'uuid' }),
    __metadata("design:type", String)
], Room.prototype, "roomTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Room.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "viewType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operational_status', length: 20, default: 'available' }),
    __metadata("design:type", String)
], Room.prototype, "operationalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'housekeeping_status', length: 20, default: 'clean' }),
    __metadata("design:type", String)
], Room.prototype, "housekeepingStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'housekeeper_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "housekeeperNotes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.rooms),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], Room.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_type_entity_1.RoomType, (roomType) => roomType.rooms),
    (0, typeorm_1.JoinColumn)({ name: 'room_type_id' }),
    __metadata("design:type", room_type_entity_1.RoomType)
], Room.prototype, "roomType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_status_history_entity_1.RoomStatusHistory, (roomStatusHistory) => roomStatusHistory.room),
    __metadata("design:type", Array)
], Room.prototype, "statusHistory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.assignedRoom),
    __metadata("design:type", Array)
], Room.prototype, "reservations", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)({ schema: 'inventory', name: 'rooms' }),
    (0, typeorm_1.Index)(['propertyId', 'number'], { unique: true })
], Room);
//# sourceMappingURL=room.entity.js.map