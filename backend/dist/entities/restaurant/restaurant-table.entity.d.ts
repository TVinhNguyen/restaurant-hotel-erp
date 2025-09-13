import { Restaurant } from './restaurant.entity';
import { RestaurantArea } from './restaurant-area.entity';
import { TableBooking } from './table-booking.entity';
export declare class RestaurantTable {
    id: string;
    restaurantId: string;
    areaId: string;
    tableNumber: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved';
    restaurant: Restaurant;
    area: RestaurantArea;
    bookings: TableBooking[];
}
