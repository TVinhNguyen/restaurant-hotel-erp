import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Property } from '../entities/core/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll(query: { page?: number; limit?: number; type?: string }) {
    const { page = 1, limit = 10, type } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.propertyRepository.createQueryBuilder('property');

    if (type) {
      queryBuilder.where('property.propertyType = :type', { type });
    }

    const [data, total] = await queryBuilder
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

  async findOne(id: string): Promise<Property> {
    // Try to get from cache first
    const cacheKey = `property:${id}`;
    const cached = await this.cacheManager.get<Property>(cacheKey);

    if (cached) {
      return cached;
    }

    // If not in cache, fetch from database
    const property = await this.propertyRepository.findOne({
      where: { id },
      // Only load basic info, no relations for performance
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Store in cache for 5 minutes
    await this.cacheManager.set(cacheKey, property, 300000);

    return property;
  }

  async findOneWithDetails(
    id: string,
    includeRelations: string[] = [],
  ): Promise<Property> {
    // Allow selective loading of relations
    const allowedRelations = [
      'roomTypes',
      'rooms',
      'restaurants',
      'ratePlans',
      'propertyServices',
      'promotions',
      'taxRules',
      'reservations',
      'workingShifts',
    ];

    const validRelations = includeRelations.filter((rel) =>
      allowedRelations.includes(rel),
    );

    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: validRelations,
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findOneWithRooms(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['roomTypes', 'rooms'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findOneWithRestaurants(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['restaurants'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(createPropertyDto);
    return await this.propertyRepository.save(property);
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    const property = await this.findOne(id);

    Object.assign(property, updatePropertyDto);

    const updated = await this.propertyRepository.save(property);

    // Invalidate cache after update
    await this.cacheManager.del(`property:${id}`);

    return updated;
  }

  async remove(id: string): Promise<void> {
    const property = await this.findOne(id);
    await this.propertyRepository.remove(property);

    // Invalidate cache after delete
    await this.cacheManager.del(`property:${id}`);
  }
}
