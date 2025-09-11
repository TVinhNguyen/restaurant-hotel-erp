import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateTableDto, UpdateTableDto } from './dto/create-table.dto';
import { CreateTableBookingDto, UpdateTableBookingDto } from './dto/create-table-booking.dto';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<import("../entities").Restaurant>;
    findAllRestaurants(page?: number, limit?: number, propertyId?: string, cuisine?: string): Promise<{
        data: import("../entities").Restaurant[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findRestaurantById(id: string): Promise<import("../entities").Restaurant>;
    updateRestaurant(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<import("../entities").Restaurant>;
    deleteRestaurant(id: string): Promise<{
        message: string;
    }>;
    createTable(createTableDto: CreateTableDto): Promise<import("../entities").RestaurantTable>;
    getAvailableTables(restaurantId: string, date: string, time: string, partySize: number): Promise<import("../entities").RestaurantTable[]>;
    findAllTables(page?: number, limit?: number, restaurantId?: string, status?: string, areaId?: string): Promise<{
        data: import("../entities").RestaurantTable[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findTableById(id: string): Promise<import("../entities").RestaurantTable>;
    updateTable(id: string, updateTableDto: UpdateTableDto): Promise<import("../entities").RestaurantTable>;
    deleteTable(id: string): Promise<{
        message: string;
    }>;
    createTableBooking(createBookingDto: CreateTableBookingDto): Promise<import("../entities").TableBooking>;
    findAllBookings(page?: number, limit?: number, restaurantId?: string, status?: string, date?: string): Promise<{
        data: import("../entities").TableBooking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findBookingById(id: string): Promise<import("../entities").TableBooking>;
    updateBooking(id: string, updateBookingDto: UpdateTableBookingDto): Promise<import("../entities").TableBooking>;
    deleteBooking(id: string): Promise<{
        message: string;
    }>;
    confirmBooking(id: string): Promise<import("../entities").TableBooking>;
    cancelBooking(id: string): Promise<import("../entities").TableBooking>;
    seatGuests(id: string, body: {
        tableId?: string;
    }): Promise<import("../entities").TableBooking>;
    completeBooking(id: string): Promise<import("../entities").TableBooking>;
}
