import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from '../entities/inventory/room-type.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Injectable()
export class RoomTypesService {
  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
  }) {
    const { page = 1, limit = 10, propertyId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roomTypeRepository.createQueryBuilder('roomType')
      .leftJoinAndSelect('roomType.property', 'property');

    if (propertyId) {
      queryBuilder.where('roomType.propertyId = :propertyId', { propertyId });
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

  async findOne(id: string): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findOne({
      where: { id },
      relations: ['property', 'rooms', 'roomTypeAmenities', 'photos'],
    });

    if (!roomType) {
      throw new NotFoundException(`Room type with ID ${id} not found`);
    }

    return roomType;
  }

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    const roomType = this.roomTypeRepository.create(createRoomTypeDto);
    return await this.roomTypeRepository.save(roomType);
  }

  async update(id: string, updateRoomTypeDto: UpdateRoomTypeDto): Promise<RoomType> {
    const roomType = await this.findOne(id);
    
    Object.assign(roomType, updateRoomTypeDto);
    
    return await this.roomTypeRepository.save(roomType);
  }

  async remove(id: string): Promise<void> {
    const roomType = await this.findOne(id);
    await this.roomTypeRepository.remove(roomType);
  }
}