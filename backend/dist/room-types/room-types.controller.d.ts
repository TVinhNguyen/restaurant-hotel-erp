import { RoomTypesService } from './room-types.service';
import { CreateRoomTypeDto, AddAmenityToRoomTypeDto, BulkAddAmenitiesToRoomTypeDto, RoomTypeQueryDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
export declare class RoomTypesController {
    private readonly roomTypesService;
    constructor(roomTypesService: RoomTypesService);
    findAll(query: RoomTypeQueryDto): Promise<{
        data: import("../entities").RoomType[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").RoomType>;
    create(createRoomTypeDto: CreateRoomTypeDto): Promise<import("../entities").RoomType>;
    update(id: string, updateRoomTypeDto: UpdateRoomTypeDto): Promise<import("../entities").RoomType>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addAmenity(roomTypeId: string, addAmenityDto: AddAmenityToRoomTypeDto): Promise<{
        roomTypeId: string;
        amenityId: string;
        amenity: {
            id: string;
            name: string;
            category: "room" | "facility";
        };
    }>;
    removeAmenity(roomTypeId: string, amenityId: string): Promise<{
        message: string;
    }>;
    addMultipleAmenities(roomTypeId: string, bulkAddDto: BulkAddAmenitiesToRoomTypeDto): Promise<{
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
