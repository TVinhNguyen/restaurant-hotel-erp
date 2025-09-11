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
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const restaurant_entity_1 = require("../entities/restaurant/restaurant.entity");
const restaurant_table_entity_1 = require("../entities/restaurant/restaurant-table.entity");
const table_booking_entity_1 = require("../entities/restaurant/table-booking.entity");
const create_table_dto_1 = require("./dto/create-table.dto");
let RestaurantsService = class RestaurantsService {
    restaurantRepository;
    tableRepository;
    bookingRepository;
    constructor(restaurantRepository, tableRepository, bookingRepository) {
        this.restaurantRepository = restaurantRepository;
        this.tableRepository = tableRepository;
        this.bookingRepository = bookingRepository;
    }
    async createRestaurant(createRestaurantDto) {
        const restaurant = this.restaurantRepository.create(createRestaurantDto);
        return await this.restaurantRepository.save(restaurant);
    }
    async findAllRestaurants(page = 1, limit = 10, propertyId, cuisine) {
        const queryBuilder = this.restaurantRepository
            .createQueryBuilder('restaurant')
            .leftJoinAndSelect('restaurant.property', 'property')
            .leftJoinAndSelect('restaurant.areas', 'areas')
            .leftJoinAndSelect('restaurant.tables', 'tables');
        if (propertyId) {
            queryBuilder.andWhere('restaurant.propertyId = :propertyId', { propertyId });
        }
        if (cuisine) {
            queryBuilder.andWhere('restaurant.cuisine ILIKE :cuisine', { cuisine: `%${cuisine}%` });
        }
        const [restaurants, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: restaurants,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findRestaurantById(id) {
        const restaurant = await this.restaurantRepository.findOne({
            where: { id },
            relations: ['property', 'areas', 'tables'],
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant with ID ${id} not found`);
        }
        return restaurant;
    }
    async updateRestaurant(id, updateRestaurantDto) {
        await this.findRestaurantById(id);
        await this.restaurantRepository.update(id, updateRestaurantDto);
        return this.findRestaurantById(id);
    }
    async deleteRestaurant(id) {
        const restaurant = await this.findRestaurantById(id);
        await this.restaurantRepository.remove(restaurant);
    }
    async createTable(createTableDto) {
        await this.findRestaurantById(createTableDto.restaurantId);
        const existingTable = await this.tableRepository.findOne({
            where: {
                restaurantId: createTableDto.restaurantId,
                tableNumber: createTableDto.tableNumber,
            },
        });
        if (existingTable) {
            throw new common_1.BadRequestException('Table number already exists in this restaurant');
        }
        const table = this.tableRepository.create({
            ...createTableDto,
            status: createTableDto.status || create_table_dto_1.TableStatus.AVAILABLE,
        });
        return await this.tableRepository.save(table);
    }
    async findAllTables(page = 1, limit = 10, restaurantId, status, areaId) {
        const queryBuilder = this.tableRepository
            .createQueryBuilder('table')
            .leftJoinAndSelect('table.restaurant', 'restaurant')
            .leftJoinAndSelect('table.area', 'area');
        if (restaurantId) {
            queryBuilder.andWhere('table.restaurantId = :restaurantId', { restaurantId });
        }
        if (status) {
            queryBuilder.andWhere('table.status = :status', { status });
        }
        if (areaId) {
            queryBuilder.andWhere('table.areaId = :areaId', { areaId });
        }
        const [tables, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: tables,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findTableById(id) {
        const table = await this.tableRepository.findOne({
            where: { id },
            relations: ['restaurant', 'area'],
        });
        if (!table) {
            throw new common_1.NotFoundException(`Table with ID ${id} not found`);
        }
        return table;
    }
    async updateTable(id, updateTableDto) {
        await this.findTableById(id);
        await this.tableRepository.update(id, updateTableDto);
        return this.findTableById(id);
    }
    async deleteTable(id) {
        const table = await this.findTableById(id);
        await this.tableRepository.remove(table);
    }
    async getAvailableTables(restaurantId, date, time, partySize) {
        const availableTables = await this.tableRepository.find({
            where: {
                restaurantId,
                status: create_table_dto_1.TableStatus.AVAILABLE,
            },
        });
        const suitableTables = availableTables.filter(table => table.capacity >= partySize);
        const bookings = await this.bookingRepository.find({
            where: {
                restaurantId,
                bookingDate: new Date(date),
                bookingTime: time,
                status: (0, typeorm_2.In)(['confirmed', 'seated']),
            },
        });
        const bookedTableIds = bookings.map(booking => booking.assignedTableId).filter(Boolean);
        return suitableTables.filter(table => !bookedTableIds.includes(table.id));
    }
    async createTableBooking(createBookingDto) {
        await this.findRestaurantById(createBookingDto.restaurantId);
        const booking = this.bookingRepository.create(createBookingDto);
        return await this.bookingRepository.save(booking);
    }
    async findAllBookings(page = 1, limit = 10, restaurantId, status, date) {
        const queryBuilder = this.bookingRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.restaurant', 'restaurant')
            .leftJoinAndSelect('booking.assignedTable', 'assignedTable');
        if (restaurantId) {
            queryBuilder.andWhere('booking.restaurantId = :restaurantId', { restaurantId });
        }
        if (status) {
            queryBuilder.andWhere('booking.status = :status', { status });
        }
        if (date) {
            queryBuilder.andWhere('booking.bookingDate = :date', { date });
        }
        const [bookings, total] = await queryBuilder
            .orderBy('booking.bookingDate', 'DESC')
            .addOrderBy('booking.bookingTime', 'ASC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findBookingById(id) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['restaurant', 'assignedTable'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async updateBooking(id, updateBookingDto) {
        await this.findBookingById(id);
        await this.bookingRepository.update(id, updateBookingDto);
        return this.findBookingById(id);
    }
    async deleteBooking(id) {
        const booking = await this.findBookingById(id);
        await this.bookingRepository.remove(booking);
    }
    async confirmBooking(id) {
        const booking = await this.findBookingById(id);
        if (booking.status !== 'pending') {
            throw new common_1.BadRequestException(`Cannot confirm booking with status: ${booking.status}`);
        }
        await this.bookingRepository.update(id, { status: 'confirmed' });
        return this.findBookingById(id);
    }
    async cancelBooking(id) {
        const booking = await this.findBookingById(id);
        if (booking.status === 'completed') {
            throw new common_1.BadRequestException('Cannot cancel completed booking');
        }
        await this.bookingRepository.update(id, { status: 'cancelled' });
        return this.findBookingById(id);
    }
    async seatGuests(id, tableId) {
        const booking = await this.findBookingById(id);
        if (booking.status !== 'confirmed') {
            throw new common_1.BadRequestException(`Cannot seat guests for booking with status: ${booking.status}`);
        }
        const table = await this.findTableById(tableId);
        if (table.status !== create_table_dto_1.TableStatus.AVAILABLE) {
            throw new common_1.BadRequestException('Selected table is not available');
        }
        await this.tableRepository.update(tableId, { status: create_table_dto_1.TableStatus.OCCUPIED });
        await this.bookingRepository.update(id, {
            status: 'seated',
            assignedTableId: tableId
        });
        return this.findBookingById(id);
    }
    async completeBooking(id) {
        const booking = await this.findBookingById(id);
        if (booking.status !== 'seated') {
            throw new common_1.BadRequestException(`Cannot complete booking with status: ${booking.status}`);
        }
        if (booking.assignedTableId) {
            await this.tableRepository.update(booking.assignedTableId, {
                status: create_table_dto_1.TableStatus.AVAILABLE
            });
        }
        await this.bookingRepository.update(id, { status: 'completed' });
        return this.findBookingById(id);
    }
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(1, (0, typeorm_1.InjectRepository)(restaurant_table_entity_1.RestaurantTable)),
    __param(2, (0, typeorm_1.InjectRepository)(table_booking_entity_1.TableBooking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map