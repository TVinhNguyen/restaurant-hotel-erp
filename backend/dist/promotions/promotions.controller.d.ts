import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
export declare class PromotionsController {
    private readonly promotionsService;
    constructor(promotionsService: PromotionsService);
    findAll(page?: string, limit?: string, propertyId?: string, active?: string): Promise<{
        data: import("../entities").Promotion[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").Promotion>;
    findByCode(code: string): Promise<import("../entities").Promotion>;
    create(createPromotionDto: CreatePromotionDto): Promise<import("../entities").Promotion>;
    update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<import("../entities").Promotion>;
    remove(id: string): Promise<{
        message: string;
    }>;
    validatePromotion(body: {
        code: string;
        propertyId: string;
    }): Promise<{
        valid: boolean;
        promotion?: import("../entities").Promotion;
        error?: string;
    }>;
}
