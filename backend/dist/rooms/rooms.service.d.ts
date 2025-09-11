import { Repository } from 'typeorm';
import { Room } from '../entities/inventory/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsService {
    private roomRepository;
    constructor(roomRepository: Repository<Room>);
    findAll(query: {
        page?: number;
        limit?: number;
        propertyId?: string;
        roomTypeId?: string;
        status?: string;
        floor?: string;
    }): Promise<{
        data: Room[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findAvailable(query: {
        page?: number;
        limit?: number;
        propertyId?: string;
        checkIn?: string;
        checkOut?: string;
    }): Promise<{
        data: Room[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<Room>;
    create(createRoomDto: CreateRoomDto): Promise<Room>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room>;
    updateStatus(id: string, statusData: {
        operationalStatus?: 'available' | 'out_of_service';
        housekeepingStatus?: 'clean' | 'dirty' | 'inspected';
        housekeeperNotes?: string;
    }): Promise<Room>;
    remove(id: string): Promise<void>;
}
