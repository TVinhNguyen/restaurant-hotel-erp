import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyService } from '../entities/reservation/property-service.entity';
import { CreatePropertyServiceDto } from './dto/create-property-service.dto';
import { UpdatePropertyServiceDto } from './dto/update-property-service.dto';

@Injectable()
export class PropertyServicesService {
  constructor(
    @InjectRepository(PropertyService)
    private propertyServiceRepository: Repository<PropertyService>,
  ) {}

  async findAllPropertyServices(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
  }) {
    const { page = 1, limit = 10, propertyId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.propertyServiceRepository
      .createQueryBuilder('propertyService')
      .leftJoinAndSelect('propertyService.property', 'property')
      .leftJoinAndSelect('propertyService.service', 'service');

    if (propertyId) {
      queryBuilder.where('propertyService.propertyId = :propertyId', {
        propertyId,
      });
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

  async findOnePropertyService(id: string): Promise<PropertyService> {
    const propertyService = await this.propertyServiceRepository.findOne({
      where: { id },
      relations: ['property', 'service'],
    });

    if (!propertyService) {
      throw new NotFoundException(`Property service with ID ${id} not found`);
    }

    return propertyService;
  }

  async createPropertyService(
    createPropertyServiceDto: CreatePropertyServiceDto,
  ): Promise<PropertyService> {
    const propertyService = this.propertyServiceRepository.create(
      createPropertyServiceDto,
    );

    return await this.propertyServiceRepository.save(propertyService);
  }

  async updatePropertyService(
    id: string,
    updatePropertyServiceDto: UpdatePropertyServiceDto,
  ): Promise<PropertyService> {
    const propertyService = await this.findOnePropertyService(id);
    Object.assign(propertyService, updatePropertyServiceDto);

    return await this.propertyServiceRepository.save(propertyService);
  }

  async removePropertyService(id: string): Promise<void> {
    const propertyService = await this.findOnePropertyService(id);
    await this.propertyServiceRepository.remove(propertyService);
  }
}
