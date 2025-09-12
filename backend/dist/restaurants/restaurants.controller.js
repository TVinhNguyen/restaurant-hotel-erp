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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const restaurants_service_1 = require("./restaurants.service");
const create_restaurant_dto_1 = require("./dto/create-restaurant.dto");
const update_restaurant_dto_1 = require("./dto/update-restaurant.dto");
const create_table_dto_1 = require("./dto/create-table.dto");
const create_table_booking_dto_1 = require("./dto/create-table-booking.dto");
let RestaurantsController = class RestaurantsController {
    restaurantsService;
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    async createRestaurant(createRestaurantDto) {
        return this.restaurantsService.createRestaurant(createRestaurantDto);
    }
    async findAllRestaurants(page = 1, limit = 10, propertyId, cuisine) {
        return this.restaurantsService.findAllRestaurants(page, limit, propertyId, cuisine);
    }
    async findRestaurantById(id) {
        return this.restaurantsService.findRestaurantById(id);
    }
    async updateRestaurant(id, updateRestaurantDto) {
        return this.restaurantsService.updateRestaurant(id, updateRestaurantDto);
    }
    async deleteRestaurant(id) {
        await this.restaurantsService.deleteRestaurant(id);
        return { message: 'Restaurant deleted successfully' };
    }
    async createTable(createTableDto) {
        return this.restaurantsService.createTable(createTableDto);
    }
    async getAvailableTables(restaurantId, date, time, partySize) {
        return this.restaurantsService.getAvailableTables(restaurantId, date, time, partySize);
    }
    async findAllTables(page = 1, limit = 10, restaurantId, status, areaId) {
        return this.restaurantsService.findAllTables(page, limit, restaurantId, status, areaId);
    }
    async findTableById(id) {
        return this.restaurantsService.findTableById(id);
    }
    async updateTable(id, updateTableDto) {
        return this.restaurantsService.updateTable(id, updateTableDto);
    }
    async deleteTable(id) {
        await this.restaurantsService.deleteTable(id);
        return { message: 'Table deleted successfully' };
    }
    async createTableBooking(createBookingDto) {
        return this.restaurantsService.createTableBooking(createBookingDto);
    }
    async findAllBookings(page = 1, limit = 10, restaurantId, status, date) {
        return this.restaurantsService.findAllBookings(page, limit, restaurantId, status, date);
    }
    async findBookingById(id) {
        return this.restaurantsService.findBookingById(id);
    }
    async updateBooking(id, updateBookingDto) {
        return this.restaurantsService.updateBooking(id, updateBookingDto);
    }
    async deleteBooking(id) {
        await this.restaurantsService.deleteBooking(id);
        return { message: 'Booking deleted successfully' };
    }
    async confirmBooking(id) {
        return this.restaurantsService.confirmBooking(id);
    }
    async cancelBooking(id) {
        return this.restaurantsService.cancelBooking(id);
    }
    async seatGuests(id, body) {
        if (!body.tableId) {
            throw new common_1.BadRequestException('Table ID is required');
        }
        return this.restaurantsService.seatGuests(id, body.tableId);
    }
    async completeBooking(id) {
        return this.restaurantsService.completeBooking(id);
    }
};
exports.RestaurantsController = RestaurantsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_restaurant_dto_1.CreateRestaurantDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "createRestaurant", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('propertyId')),
    __param(3, (0, common_1.Query)('cuisine')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findAllRestaurants", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findRestaurantById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_restaurant_dto_1.UpdateRestaurantDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "updateRestaurant", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "deleteRestaurant", null);
__decorate([
    (0, common_1.Post)('tables'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_table_dto_1.CreateTableDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "createTable", null);
__decorate([
    (0, common_1.Get)('tables/available'),
    __param(0, (0, common_1.Query)('restaurantId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('time')),
    __param(3, (0, common_1.Query)('partySize', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getAvailableTables", null);
__decorate([
    (0, common_1.Get)('tables'),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('restaurantId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('areaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findAllTables", null);
__decorate([
    (0, common_1.Get)('tables/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findTableById", null);
__decorate([
    (0, common_1.Put)('tables/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_table_dto_1.UpdateTableDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "updateTable", null);
__decorate([
    (0, common_1.Delete)('tables/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "deleteTable", null);
__decorate([
    (0, common_1.Post)('bookings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_table_booking_dto_1.CreateTableBookingDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "createTableBooking", null);
__decorate([
    (0, common_1.Get)('bookings'),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('restaurantId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findAllBookings", null);
__decorate([
    (0, common_1.Get)('bookings/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findBookingById", null);
__decorate([
    (0, common_1.Put)('bookings/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_table_booking_dto_1.UpdateTableBookingDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "updateBooking", null);
__decorate([
    (0, common_1.Delete)('bookings/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "deleteBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:id/confirm'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:id/seat'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "seatGuests", null);
__decorate([
    (0, common_1.Post)('bookings/:id/complete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "completeBooking", null);
exports.RestaurantsController = RestaurantsController = __decorate([
    (0, common_1.Controller)('restaurants'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsController);
//# sourceMappingURL=restaurants.controller.js.map