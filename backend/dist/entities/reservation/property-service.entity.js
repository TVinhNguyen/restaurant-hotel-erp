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
exports.PropertyService = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../core/property.entity");
const service_entity_1 = require("./service.entity");
let PropertyService = class PropertyService {
    id;
    propertyId;
    serviceId;
    price;
    currency;
    isActive;
    property;
    service;
};
exports.PropertyService = PropertyService;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PropertyService.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid' }),
    __metadata("design:type", String)
], PropertyService.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_id', type: 'uuid' }),
    __metadata("design:type", String)
], PropertyService.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], PropertyService.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], PropertyService.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], PropertyService.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.propertyServices),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], PropertyService.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_entity_1.Service, (service) => service.propertyServices),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", service_entity_1.Service)
], PropertyService.prototype, "service", void 0);
exports.PropertyService = PropertyService = __decorate([
    (0, typeorm_1.Entity)({ schema: 'reservation', name: 'property_services' })
], PropertyService);
//# sourceMappingURL=property-service.entity.js.map