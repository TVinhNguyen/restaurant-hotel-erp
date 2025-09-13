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
exports.Restaurant = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../core/property.entity");
const restaurant_area_entity_1 = require("./restaurant-area.entity");
const restaurant_table_entity_1 = require("./restaurant-table.entity");
let Restaurant = class Restaurant {
    id;
    propertyId;
    name;
    cuisine;
    openTime;
    closeTime;
    maxCapacity;
    property;
    areas;
    tables;
};
exports.Restaurant = Restaurant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Restaurant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid' }),
    __metadata("design:type", String)
], Restaurant.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Restaurant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "cuisine", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'open_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "openTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'close_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "closeTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_capacity', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Restaurant.prototype, "maxCapacity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.restaurants),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], Restaurant.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => restaurant_area_entity_1.RestaurantArea, (restaurantArea) => restaurantArea.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "areas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => restaurant_table_entity_1.RestaurantTable, (restaurantTable) => restaurantTable.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "tables", void 0);
exports.Restaurant = Restaurant = __decorate([
    (0, typeorm_1.Entity)({ schema: 'restaurant', name: 'restaurants' })
], Restaurant);
//# sourceMappingURL=restaurant.entity.js.map