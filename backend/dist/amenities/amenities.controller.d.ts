import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto, UpdateAmenityDto, AmenityQueryDto } from './dto/amenity.dto';
export declare class AmenitiesController {
    private readonly amenitiesService;
    constructor(amenitiesService: AmenitiesService);
    create(createAmenityDto: CreateAmenityDto): Promise<import("../entities").Amenity>;
    findAll(query: AmenityQueryDto): Promise<{
        data: import("../entities").Amenity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../entities").Amenity>;
    update(id: string, updateAmenityDto: UpdateAmenityDto): Promise<import("../entities").Amenity>;
    remove(id: string): Promise<import("../entities").Amenity>;
}
