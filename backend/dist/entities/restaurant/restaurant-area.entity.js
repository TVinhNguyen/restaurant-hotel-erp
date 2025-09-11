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
exports.RestaurantArea = void 0;
const typeorm_1 = require("typeorm");
const restaurant_entity_1 = require("./restaurant.entity");
const restaurant_table_entity_1 = require("./restaurant-table.entity");
let RestaurantArea = class RestaurantArea {
    id;
    restaurantId;
    name;
    description;
    restaurant;
    tables;
};
exports.RestaurantArea = RestaurantArea;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RestaurantArea.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'restaurant_id', type: 'uuid' }),
    __metadata("design:type", String)
], RestaurantArea.prototype, "restaurantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], RestaurantArea.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RestaurantArea.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_entity_1.Restaurant, (restaurant) => restaurant.areas),
    (0, typeorm_1.JoinColumn)({ name: 'restaurant_id' }),
    __metadata("design:type", restaurant_entity_1.Restaurant)
], RestaurantArea.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => restaurant_table_entity_1.RestaurantTable, (restaurantTable) => restaurantTable.area),
    __metadata("design:type", Array)
], RestaurantArea.prototype, "tables", void 0);
exports.RestaurantArea = RestaurantArea = __decorate([
    (0, typeorm_1.Entity)({ schema: 'restaurant', name: 'restaurant_areas' })
], RestaurantArea);
//# sourceMappingURL=restaurant-area.entity.js.map