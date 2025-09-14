import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyService } from '../entities/reservation/property-service.entity';
import { Service } from '../entities/reservation/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(PropertyService)
    private propertyServiceRepository: Repository<PropertyService>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async findAllServices(query: {
    page?: number;
    limit?: number;
    category?: string;
  }) {
    const { page = 1, limit = 10, category } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.serviceRepository.createQueryBuilder('service');

    if (category) {
      queryBuilder.where('service.category = :category', { category });
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

  async createService(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepository.create(createServiceDto);
    return await this.serviceRepository.save(service);
  }

  async findOneService(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async updateService(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    Object.assign(service, updateServiceDto);
    return await this.serviceRepository.save(service);
  }

  async removeService(id: string): Promise<void> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    await this.serviceRepository.remove(service);
  }
}