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
exports.RestaurantTable = void 0;
const typeorm_1 = require("typeorm");
const restaurant_entity_1 = require("./restaurant.entity");
const restaurant_area_entity_1 = require("./restaurant-area.entity");
const table_booking_entity_1 = require("./table-booking.entity");
let RestaurantTable = class RestaurantTable {
    id;
    restaurantId;
    areaId;
    tableNumber;
    capacity;
    status;
    restaurant;
    area;
    bookings;
};
exports.RestaurantTable = RestaurantTable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RestaurantTable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'restaurant_id', type: 'uuid' }),
    __metadata("design:type", String)
], RestaurantTable.prototype, "restaurantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'area_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], RestaurantTable.prototype, "areaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'table_number', length: 20 }),
    __metadata("design:type", String)
], RestaurantTable.prototype, "tableNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], RestaurantTable.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'available' }),
    __metadata("design:type", String)
], RestaurantTable.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_entity_1.Restaurant, (restaurant) => restaurant.tables),
    (0, typeorm_1.JoinColumn)({ name: 'restaurant_id' }),
    __metadata("design:type", restaurant_entity_1.Restaurant)
], RestaurantTable.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_area_entity_1.RestaurantArea, (area) => area.tables, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'area_id' }),
    __metadata("design:type", restaurant_area_entity_1.RestaurantArea)
], RestaurantTable.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => table_booking_entity_1.TableBooking, (tableBooking) => tableBooking.assignedTable),
    __metadata("design:type", Array)
], RestaurantTable.prototype, "bookings", void 0);
exports.RestaurantTable = RestaurantTable = __decorate([
    (0, typeorm_1.Entity)({ schema: 'restaurant', name: 'restaurant_tables' }),
    (0, typeorm_1.Index)(['restaurantId', 'tableNumber'], { unique: true })
], RestaurantTable);
//# sourceMappingURL=restaurant-table.entity.js.map