import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amenity } from '../entities/inventory/amenity.entity';
import {
  CreateAmenityDto,
  UpdateAmenityDto,
  AmenityQueryDto,
} from './dto/amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity)
    private amenityRepository: Repository<Amenity>,
  ) {}

  async create(createAmenityDto: CreateAmenityDto) {
    const amenity = this.amenityRepository.create(createAmenityDto);
    return await this.amenityRepository.save(amenity);
  }

  async findAll(query: AmenityQueryDto) {
    const { page = 1, limit = 10, category, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.amenityRepository
      .createQueryBuilder('amenity')
      .leftJoinAndSelect('amenity.roomTypeAmenities', 'roomTypeAmenities')
      .leftJoinAndSelect('roomTypeAmenities.roomType', 'roomType')
      .leftJoinAndSelect('roomType.property', 'property');

    if (category) {
      queryBuilder.where('amenity.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere('amenity.name ILIKE :search', {
        search: `%${search}%`,
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
    };
  }

  async findOne(id: string) {
    const amenity = await this.amenityRepository.findOne({
      where: { id },
      relations: [
        'roomTypeAmenities',
        'roomTypeAmenities.roomType',
        'roomTypeAmenities.roomType.property',
      ],
    });

    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    return amenity;
  }

  async update(id: string, updateAmenityDto: UpdateAmenityDto) {
    await this.findOne(id); // Check if exists

    await this.amenityRepository.update(id, updateAmenityDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const amenity = await this.findOne(id); // Check if exists

    return await this.amenityRepository.remove(amenity);
  }
}
