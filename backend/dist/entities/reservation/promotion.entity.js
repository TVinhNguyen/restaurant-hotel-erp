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
exports.Promotion = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../core/property.entity");
let Promotion = class Promotion {
    id;
    propertyId;
    code;
    name;
    discountType;
    discountValue;
    validFrom;
    validTo;
    isActive;
    property;
};
exports.Promotion = Promotion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Promotion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid' }),
    __metadata("design:type", String)
], Promotion.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Promotion.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Promotion.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_type', length: 20 }),
    __metadata("design:type", String)
], Promotion.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Promotion.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_from', type: 'date' }),
    __metadata("design:type", Date)
], Promotion.prototype, "validFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_to', type: 'date' }),
    __metadata("design:type", Date)
], Promotion.prototype, "validTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Promotion.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.promotions),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], Promotion.prototype, "property", void 0);
exports.Promotion = Promotion = __decorate([
    (0, typeorm_1.Entity)({ schema: 'reservation', name: 'promotions' })
], Promotion);
//# sourceMappingURL=promotion.entity.js.map