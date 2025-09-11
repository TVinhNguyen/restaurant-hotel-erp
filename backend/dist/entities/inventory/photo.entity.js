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
exports.Photo = void 0;
const typeorm_1 = require("typeorm");
const room_type_entity_1 = require("./room-type.entity");
let Photo = class Photo {
    id;
    roomTypeId;
    url;
    caption;
    roomType;
};
exports.Photo = Photo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Photo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_type_id', type: 'uuid' }),
    __metadata("design:type", String)
], Photo.prototype, "roomTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Photo.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Photo.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_type_entity_1.RoomType, (roomType) => roomType.photos),
    (0, typeorm_1.JoinColumn)({ name: 'room_type_id' }),
    __metadata("design:type", room_type_entity_1.RoomType)
], Photo.prototype, "roomType", void 0);
exports.Photo = Photo = __decorate([
    (0, typeorm_1.Entity)({ schema: 'inventory', name: 'photos' })
], Photo);
//# sourceMappingURL=photo.entity.js.map