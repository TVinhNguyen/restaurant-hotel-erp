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
exports.Amenity = void 0;
const typeorm_1 = require("typeorm");
const room_type_amenity_entity_1 = require("./room-type-amenity.entity");
let Amenity = class Amenity {
    id;
    name;
    category;
    roomTypeAmenities;
};
exports.Amenity = Amenity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Amenity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Amenity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Amenity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_type_amenity_entity_1.RoomTypeAmenity, (roomTypeAmenity) => roomTypeAmenity.amenity),
    __metadata("design:type", Array)
], Amenity.prototype, "roomTypeAmenities", void 0);
exports.Amenity = Amenity = __decorate([
    (0, typeorm_1.Entity)({ schema: 'inventory', name: 'amenities' })
], Amenity);
//# sourceMappingURL=amenity.entity.js.map