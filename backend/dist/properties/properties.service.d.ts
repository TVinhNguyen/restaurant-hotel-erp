import { Repository } from 'typeorm';
import { Property } from '../entities/core/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertiesService {
    private propertyRepository;
    constructor(propertyRepository: Repository<Property>);
    findAll(query: {
        page?: number;
        limit?: number;
        type?: string;
    }): Promise<{
        data: Property[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<Property>;
    findOneWithDetails(id: string, includeRelations?: string[]): Promise<Property>;
    findOneWithRooms(id: string): Promise<Property>;
    findOneWithRestaurants(id: string): Promise<Property>;
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    remove(id: string): Promise<void>;
}
