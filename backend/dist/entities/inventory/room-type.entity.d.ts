import { Property } from '../core/property.entity';
import { RoomTypeAmenity } from './room-type-amenity.entity';
import { Photo } from './photo.entity';
import { Room } from './room.entity';
import { RatePlan } from '../reservation/rate-plan.entity';
import { Reservation } from '../reservation/reservation.entity';
export declare class RoomType {
    id: string;
    propertyId: string;
    name: string;
    description: string;
    maxAdults: number;
    maxChildren: number;
    basePrice: number;
    bedType: string;
    property: Property;
    roomTypeAmenities: RoomTypeAmenity[];
    photos: Photo[];
    rooms: Room[];
    ratePlans: RatePlan[];
    reservations: Reservation[];
}
