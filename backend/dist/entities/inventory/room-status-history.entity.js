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
exports.RoomStatusHistory = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("./room.entity");
const employee_entity_1 = require("../core/employee.entity");
let RoomStatusHistory = class RoomStatusHistory {
    id;
    roomId;
    statusType;
    status;
    changedAt;
    changedBy;
    notes;
    room;
    changedByEmployee;
};
exports.RoomStatusHistory = RoomStatusHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoomStatusHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id', type: 'uuid' }),
    __metadata("design:type", String)
], RoomStatusHistory.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status_type', length: 20 }),
    __metadata("design:type", String)
], RoomStatusHistory.prototype, "statusType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], RoomStatusHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'changed_at' }),
    __metadata("design:type", Date)
], RoomStatusHistory.prototype, "changedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], RoomStatusHistory.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RoomStatusHistory.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.statusHistory),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], RoomStatusHistory.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'changed_by' }),
    __metadata("design:type", employee_entity_1.Employee)
], RoomStatusHistory.prototype, "changedByEmployee", void 0);
exports.RoomStatusHistory = RoomStatusHistory = __decorate([
    (0, typeorm_1.Entity)({ schema: 'inventory', name: 'room_status_history' })
], RoomStatusHistory);
//# sourceMappingURL=room-status-history.entity.js.map