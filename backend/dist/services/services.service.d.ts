import { Repository } from 'typeorm';
import { PropertyService } from '../entities/reservation/property-service.entity';
import { Service } from '../entities/reservation/service.entity';
import { CreatePropertyServiceDto } from './dto/create-property-service.dto';
import { UpdatePropertyServiceDto } from './dto/update-property-service.dto';
export declare class ServicesService {
    private propertyServiceRepository;
    private serviceRepository;
    constructor(propertyServiceRepository: Repository<PropertyService>, serviceRepository: Repository<Service>);
    findAllServices(query: {
        page?: number;
        limit?: number;
        category?: string;
    }): Promise<{
        data: Service[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findAllPropertyServices(query: {
        page?: number;
        limit?: number;
        propertyId?: string;
        isActive?: boolean;
    }): Promise<{
        data: PropertyService[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOnePropertyService(id: string): Promise<PropertyService>;
    createPropertyService(createPropertyServiceDto: CreatePropertyServiceDto): Promise<PropertyService>;
    updatePropertyService(id: string, updatePropertyServiceDto: UpdatePropertyServiceDto): Promise<PropertyService>;
    removePropertyService(id: string): Promise<void>;
}
