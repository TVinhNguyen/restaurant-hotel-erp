import { ServicesService } from './services.service';
import { CreatePropertyServiceDto } from './dto/create-property-service.dto';
import { UpdatePropertyServiceDto } from './dto/update-property-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAllServices(page?: string, limit?: string, category?: string): Promise<{
        data: import("../entities").Service[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findAllPropertyServices(page?: string, limit?: string, propertyId?: string, isActive?: string): Promise<{
        data: import("../entities").PropertyService[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOnePropertyService(id: string): Promise<import("../entities").PropertyService>;
    createPropertyService(createPropertyServiceDto: CreatePropertyServiceDto): Promise<import("../entities").PropertyService>;
    updatePropertyService(id: string, updatePropertyServiceDto: UpdatePropertyServiceDto): Promise<import("../entities").PropertyService>;
    removePropertyService(id: string): Promise<{
        message: string;
    }>;
}
