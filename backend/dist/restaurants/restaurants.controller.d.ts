import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateTableDto, UpdateTableDto } from './dto/create-table.dto';
import { CreateTableBookingDto, UpdateTableBookingDto } from './dto/create-table-booking.dto';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<any>;
    findAllRestaurants(page?: number, limit?: number, propertyId?: string, cuisine?: string): Promise<any>;
    findRestaurantById(id: string): Promise<any>;
    updateRestaurant(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<any>;
    deleteRestaurant(id: string): Promise<{
        message: string;
    }>;
    createTable(createTableDto: CreateTableDto): Promise<any>;
    getAvailableTables(restaurantId: string, date: string, time: string, partySize: number): Promise<any>;
    findAllTables(page?: number, limit?: number, restaurantId?: string, status?: string, areaId?: string): Promise<any>;
    findTableById(id: string): Promise<any>;
    updateTable(id: string, updateTableDto: UpdateTableDto): Promise<any>;
    deleteTable(id: string): Promise<{
        message: string;
    }>;
    createTableBooking(createBookingDto: CreateTableBookingDto): Promise<any>;
    findAllBookings(page?: number, limit?: number, restaurantId?: string, status?: string, date?: string): Promise<any>;
    findBookingById(id: string): Promise<any>;
    updateBooking(id: string, updateBookingDto: UpdateTableBookingDto): Promise<any>;
    deleteBooking(id: string): Promise<{
        message: string;
    }>;
    confirmBooking(id: string): Promise<any>;
    cancelBooking(id: string): Promise<any>;
    seatGuests(id: string, body: {
        tableId?: string;
    }): Promise<any>;
    completeBooking(id: string): Promise<any>;
}
