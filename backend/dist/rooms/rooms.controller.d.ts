import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomStatusDto, RoomQueryDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    findAll(query: RoomQueryDto): Promise<{
        data: import("../entities").Room[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").Room>;
    create(createRoomDto: CreateRoomDto): Promise<import("../entities").Room>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<import("../entities").Room>;
    updateStatus(id: string, updateStatusDto: UpdateRoomStatusDto): Promise<import("../entities").Room>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
