import { Repository } from 'typeorm';
import { Guest } from '../entities/core/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
export declare class GuestsService {
    private guestRepository;
    constructor(guestRepository: Repository<Guest>);
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: Guest[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<Guest>;
    create(createGuestDto: CreateGuestDto): Promise<Guest>;
    update(id: string, updateGuestDto: UpdateGuestDto): Promise<Guest>;
    remove(id: string): Promise<void>;
}
