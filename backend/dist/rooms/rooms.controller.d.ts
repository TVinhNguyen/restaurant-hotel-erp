import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    findAll(page?: string, limit?: string, propertyId?: string, roomTypeId?: string, status?: string, floor?: string): Promise<{
        data: import("../entities").Room[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findAvailable(page?: string, limit?: string, propertyId?: string, checkIn?: string, checkOut?: string): Promise<{
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
    updateStatus(id: string, statusData: {
        operationalStatus?: 'available' | 'out_of_service';
        housekeepingStatus?: 'clean' | 'dirty' | 'inspected';
        housekeeperNotes?: string;
    }): Promise<import("../entities").Room>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
