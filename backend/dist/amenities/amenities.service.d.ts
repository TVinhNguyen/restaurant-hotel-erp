import { Repository } from 'typeorm';
import { Amenity } from '../entities/inventory/amenity.entity';
import { CreateAmenityDto, UpdateAmenityDto, AmenityQueryDto } from './dto/amenity.dto';
export declare class AmenitiesService {
    private amenityRepository;
    constructor(amenityRepository: Repository<Amenity>);
    create(createAmenityDto: CreateAmenityDto): Promise<Amenity>;
    findAll(query: AmenityQueryDto): Promise<{
        data: Amenity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Amenity>;
    update(id: string, updateAmenityDto: UpdateAmenityDto): Promise<Amenity>;
    remove(id: string): Promise<Amenity>;
}
