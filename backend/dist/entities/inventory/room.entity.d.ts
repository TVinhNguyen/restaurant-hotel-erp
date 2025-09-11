import { Property } from '../core/property.entity';
import { RoomType } from './room-type.entity';
import { RoomStatusHistory } from './room-status-history.entity';
import { Reservation } from '../reservation/reservation.entity';
export declare class Room {
    id: string;
    propertyId: string;
    roomTypeId: string;
    number: string;
    floor: string;
    viewType: string;
    operationalStatus: 'available' | 'out_of_service';
    housekeepingStatus: 'clean' | 'dirty' | 'inspected';
    housekeeperNotes: string;
    property: Property;
    roomType: RoomType;
    statusHistory: RoomStatusHistory[];
    reservations: Reservation[];
}
