import { RoomTypeAmenity } from './room-type-amenity.entity';
export declare class Amenity {
    id: string;
    name: string;
    category: 'room' | 'facility';
    roomTypeAmenities: RoomTypeAmenity[];
}
