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
exports.TaxRule = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../core/property.entity");
let TaxRule = class TaxRule {
    id;
    propertyId;
    taxName;
    taxRate;
    isInclusive;
    isActive;
    property;
};
exports.TaxRule = TaxRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaxRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid' }),
    __metadata("design:type", String)
], TaxRule.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_name', length: 100 }),
    __metadata("design:type", String)
], TaxRule.prototype, "taxName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], TaxRule.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_inclusive', default: false }),
    __metadata("design:type", Boolean)
], TaxRule.prototype, "isInclusive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], TaxRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.taxRules),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], TaxRule.prototype, "property", void 0);
exports.TaxRule = TaxRule = __decorate([
    (0, typeorm_1.Entity)({ schema: 'reservation', name: 'tax_rules' })
], TaxRule);
//# sourceMappingURL=tax-rule.entity.js.map