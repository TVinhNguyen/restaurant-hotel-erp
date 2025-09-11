import { RoomTypesService } from './room-types.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
export declare class RoomTypesController {
    private readonly roomTypesService;
    constructor(roomTypesService: RoomTypesService);
    findAll(page?: string, limit?: string, propertyId?: string): Promise<{
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
}
