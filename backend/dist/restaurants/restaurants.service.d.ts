import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant/restaurant.entity';
import { RestaurantTable } from '../entities/restaurant/restaurant-table.entity';
import { TableBooking as RestaurantTableBooking } from '../entities/restaurant/table-booking.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateTableDto, UpdateTableDto } from './dto/create-table.dto';
import { CreateTableBookingDto, UpdateTableBookingDto } from './dto/create-table-booking.dto';
export declare class RestaurantsService {
    private restaurantRepository;
    private tableRepository;
    private bookingRepository;
    constructor(restaurantRepository: Repository<Restaurant>, tableRepository: Repository<RestaurantTable>, bookingRepository: Repository<RestaurantTableBooking>);
    createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant>;
    findAllRestaurants(page?: number, limit?: number, propertyId?: string, cuisine?: string): Promise<{
        data: Restaurant[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findRestaurantById(id: string): Promise<Restaurant>;
    updateRestaurant(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant>;
    deleteRestaurant(id: string): Promise<void>;
    createTable(createTableDto: CreateTableDto): Promise<RestaurantTable>;
    findAllTables(page?: number, limit?: number, restaurantId?: string, status?: string, areaId?: string): Promise<{
        data: RestaurantTable[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findTableById(id: string): Promise<RestaurantTable>;
    updateTable(id: string, updateTableDto: UpdateTableDto): Promise<RestaurantTable>;
    deleteTable(id: string): Promise<void>;
    getAvailableTables(restaurantId: string, date: string, time: string, partySize: number): Promise<RestaurantTable[]>;
    createTableBooking(createBookingDto: CreateTableBookingDto): Promise<RestaurantTableBooking>;
    findAllBookings(page?: number, limit?: number, restaurantId?: string, status?: string, date?: string): Promise<{
        data: RestaurantTableBooking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findBookingById(id: string): Promise<RestaurantTableBooking>;
    updateBooking(id: string, updateBookingDto: UpdateTableBookingDto): Promise<RestaurantTableBooking>;
    deleteBooking(id: string): Promise<void>;
}
