import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
export declare class GuestsController {
    private readonly guestsService;
    constructor(guestsService: GuestsService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: import("../entities").Guest[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").Guest>;
    create(createGuestDto: CreateGuestDto): Promise<import("../entities").Guest>;
    update(id: string, updateGuestDto: UpdateGuestDto): Promise<import("../entities").Guest>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
