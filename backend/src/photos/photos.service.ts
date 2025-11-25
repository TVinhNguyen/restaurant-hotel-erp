import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../entities/inventory/photo.entity';
import { CreatePhotoDto, UpdatePhotoDto, PhotoQueryDto } from './dto/photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto) {
    const photo = this.photoRepository.create(createPhotoDto);
    return await this.photoRepository.save(photo);
  }

  async findAll(query: PhotoQueryDto) {
    const { page = 1, limit = 10, roomTypeId, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.photoRepository
      .createQueryBuilder('photo')
      .leftJoinAndSelect('photo.roomType', 'roomType')
      .leftJoinAndSelect('roomType.property', 'property');

    if (roomTypeId) {
      queryBuilder.where('photo.roomTypeId = :roomTypeId', { roomTypeId });
    }

    if (search) {
      queryBuilder.andWhere('photo.caption ILIKE :search', {
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
    const photo = await this.photoRepository.findOne({
      where: { id },
      relations: ['roomType', 'roomType.property'],
    });

    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return photo;
  }

  async findByRoomType(roomTypeId: string) {
    return await this.photoRepository.find({
      where: { roomTypeId },
      relations: ['roomType'],
      order: { caption: 'ASC' },
    });
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto) {
    await this.findOne(id); // Check if exists

    await this.photoRepository.update(id, updatePhotoDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const photo = await this.findOne(id); // Check if exists

    return await this.photoRepository.remove(photo);
  }

  async removeByRoomType(roomTypeId: string) {
    const photos = await this.photoRepository.find({
      where: { roomTypeId },
    });

    return await this.photoRepository.remove(photos);
  }
}
