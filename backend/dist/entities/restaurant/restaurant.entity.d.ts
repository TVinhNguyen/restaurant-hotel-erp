import { Property } from '../core/property.entity';
import { RestaurantArea } from './restaurant-area.entity';
import { RestaurantTable } from './restaurant-table.entity';
export declare class Restaurant {
    id: string;
    propertyId: string;
    name: string;
    cuisine: string;
    openTime: string;
    closeTime: string;
    maxCapacity: number;
    property: Property;
    areas: RestaurantArea[];
    tables: RestaurantTable[];
}
