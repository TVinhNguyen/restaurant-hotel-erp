import { Repository } from 'typeorm';
import { RoomType } from '../entities/inventory/room-type.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
export declare class RoomTypesService {
    private roomTypeRepository;
    constructor(roomTypeRepository: Repository<RoomType>);
    findAll(query: {
        page?: number;
        limit?: number;
        propertyId?: string;
    }): Promise<{
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
}
