import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from '../entities/reservation/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
    active?: boolean;
  }) {
    const { page = 1, limit = 10, propertyId, active } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.promotionRepository.createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.property', 'property');

    if (propertyId) {
      queryBuilder.andWhere('promotion.propertyId = :propertyId', { propertyId });
    }

    if (active !== undefined) {
      const currentDate = new Date().toISOString().split('T')[0];
      if (active) {
        queryBuilder.andWhere('promotion.validFrom <= :currentDate', { currentDate })
          .andWhere('promotion.validTo >= :currentDate', { currentDate });
      } else {
        queryBuilder.andWhere(
          '(promotion.validFrom > :currentDate OR promotion.validTo < :currentDate)',
          { currentDate }
        );
      }
    }

    const [data, total] = await queryBuilder
      .orderBy('promotion.validFrom', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['property'],
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    return promotion;
  }

  async findByCode(code: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOne({
      where: { code },
      relations: ['property'],
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with code ${code} not found`);
    }

    return promotion;
  }

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    // Check if code already exists
    const existingPromotion = await this.promotionRepository.findOne({
      where: { code: createPromotionDto.code },
    });

    if (existingPromotion) {
      throw new ConflictException(`Promotion with code ${createPromotionDto.code} already exists`);
    }

    // Create entity data with proper type conversion
    const entityData = {
      propertyId: createPromotionDto.propertyId,
      code: createPromotionDto.code,
      discountPercent: createPromotionDto.discountPercent,
      validFrom: createPromotionDto.validFrom ? new Date(createPromotionDto.validFrom) : undefined,
      validTo: createPromotionDto.validTo ? new Date(createPromotionDto.validTo) : undefined,
    };

    const promotion = this.promotionRepository.create(entityData);
    return await this.promotionRepository.save(promotion);
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    const promotion = await this.findOne(id);
    
    // Check if code already exists for other promotions
    if (updatePromotionDto.code && updatePromotionDto.code !== promotion.code) {
      const existingPromotion = await this.promotionRepository.findOne({
        where: { code: updatePromotionDto.code },
      });

      if (existingPromotion && existingPromotion.id !== id) {
        throw new ConflictException(`Promotion with code ${updatePromotionDto.code} already exists`);
      }
    }

    // Update fields individually to handle type conversion
    if (updatePromotionDto.code !== undefined) {
      promotion.code = updatePromotionDto.code;
    }
    if (updatePromotionDto.discountPercent !== undefined) {
      promotion.discountPercent = updatePromotionDto.discountPercent;
    }
    if (updatePromotionDto.validFrom !== undefined) {
      promotion.validFrom = new Date(updatePromotionDto.validFrom);
    }
    if (updatePromotionDto.validTo !== undefined) {
      promotion.validTo = new Date(updatePromotionDto.validTo);
    }
    
    return await this.promotionRepository.save(promotion);
  }

  async remove(id: string): Promise<void> {
    const promotion = await this.findOne(id);
    await this.promotionRepository.remove(promotion);
  }

  async validatePromotion(code: string, propertyId: string): Promise<{ valid: boolean; promotion?: Promotion; error?: string }> {
    try {
      const promotion = await this.findByCode(code);
      
      if (promotion.propertyId !== propertyId) {
        return { valid: false, error: 'Promotion not valid for this property' };
      }

      const currentDate = new Date();
      const validFrom = promotion.validFrom ? new Date(promotion.validFrom) : null;
      const validTo = promotion.validTo ? new Date(promotion.validTo) : null;

      if (validFrom && currentDate < validFrom) {
        return { valid: false, error: 'Promotion not yet active' };
      }

      if (validTo && currentDate > validTo) {
        return { valid: false, error: 'Promotion has expired' };
      }

      return { valid: true, promotion };
    } catch (error) {
      return { valid: false, error: 'Promotion not found' };
    }
  }
}
