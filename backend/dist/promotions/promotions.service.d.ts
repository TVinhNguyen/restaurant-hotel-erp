import { Repository } from 'typeorm';
import { Promotion } from '../entities/reservation/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
export declare class PromotionsService {
    private promotionRepository;
    constructor(promotionRepository: Repository<Promotion>);
    findAll(query: {
        page?: number;
        limit?: number;
        propertyId?: string;
        active?: boolean;
    }): Promise<{
        data: Promotion[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<Promotion>;
    findByCode(code: string): Promise<Promotion>;
    create(createPromotionDto: CreatePromotionDto): Promise<Promotion>;
    update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion>;
    remove(id: string): Promise<void>;
    validatePromotion(code: string, propertyId: string): Promise<{
        valid: boolean;
        promotion?: Promotion;
        error?: string;
    }>;
}
