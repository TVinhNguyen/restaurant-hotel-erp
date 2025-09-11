import { Restaurant } from './restaurant.entity';
import { RestaurantTable } from './restaurant-table.entity';
export declare class RestaurantArea {
    id: string;
    restaurantId: string;
    name: string;
    description: string;
    restaurant: Restaurant;
    tables: RestaurantTable[];
}
