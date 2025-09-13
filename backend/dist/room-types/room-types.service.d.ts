import { Repository } from 'typeorm';
import { RoomType } from '../entities/inventory/room-type.entity';
import { RoomTypeAmenity } from '../entities/inventory/room-type-amenity.entity';
import { Amenity } from '../entities/inventory/amenity.entity';
import { CreateRoomTypeDto, RoomTypeQueryDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
export declare class RoomTypesService {
    private roomTypeRepository;
    private roomTypeAmenityRepository;
    private amenityRepository;
    constructor(roomTypeRepository: Repository<RoomType>, roomTypeAmenityRepository: Repository<RoomTypeAmenity>, amenityRepository: Repository<Amenity>);
    findAll(query: RoomTypeQueryDto): Promise<{
        data: RoomType[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<RoomType>;
    create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType>;
    update(id: string, updateRoomTypeDto: UpdateRoomTypeDto): Promise<RoomType>;
    remove(id: string): Promise<void>;
    addAmenity(roomTypeId: string, amenityId: string): Promise<{
        roomTypeId: string;
        amenityId: string;
        amenity: {
            id: string;
            name: string;
            category: "room" | "facility";
        };
    }>;
    removeAmenity(roomTypeId: string, amenityId: string): Promise<void>;
    addMultipleAmenities(roomTypeId: string, amenityIds: string[]): Promise<{
        roomTypeId: string;
        addedAmenities: never[];
        createdCount: number;
        message: string;
    } | {
        roomTypeId: string;
        addedAmenities: {
            amenityId: string;
            name: string;
        }[];
        createdCount: number;
        message?: undefined;
    }>;
}
