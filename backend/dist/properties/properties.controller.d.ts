import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    findAll(page?: string, limit?: string, type?: string): Promise<{
        data: import("../entities").Property[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOneWithRooms(id: string): Promise<import("../entities").Property>;
    findOneWithRestaurants(id: string): Promise<import("../entities").Property>;
    findOne(id: string, include?: string): Promise<import("../entities").Property>;
    create(createPropertyDto: CreatePropertyDto): Promise<import("../entities").Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<import("../entities").Property>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
