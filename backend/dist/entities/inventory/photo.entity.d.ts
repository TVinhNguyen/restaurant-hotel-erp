import { RoomType } from './room-type.entity';
export declare class Photo {
    id: string;
    roomTypeId: string;
    url: string;
    caption: string;
    roomType: RoomType;
}
