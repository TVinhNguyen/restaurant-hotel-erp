import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/inventory/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
    roomTypeId?: string;
    status?: string;
    floor?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      propertyId,
      roomTypeId,
      status,
      floor,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.property', 'property')
      .leftJoinAndSelect('room.roomType', 'roomType');

    if (propertyId) {
      queryBuilder.andWhere('room.propertyId = :propertyId', { propertyId });
    }

    if (roomTypeId) {
      queryBuilder.andWhere('room.roomTypeId = :roomTypeId', { roomTypeId });
    }

    if (status) {
      queryBuilder.andWhere('room.operationalStatus = :status', { status });
    }

    if (floor) {
      queryBuilder.andWhere('room.floor = :floor', { floor });
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

  async findAvailable(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
    checkIn?: string;
    checkOut?: string;
  }) {
    const { page = 1, limit = 10, propertyId, checkIn, checkOut } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.property', 'property')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .where('room.operationalStatus = :status', { status: 'available' });

    if (propertyId) {
      queryBuilder.andWhere('room.propertyId = :propertyId', { propertyId });
    }

    // Check for conflicting reservations if dates provided
    if (checkIn && checkOut) {
      queryBuilder.andWhere(
        `
        room.id NOT IN (
          SELECT DISTINCT r.assignedRoomId 
          FROM reservation.reservations r 
          WHERE r.assignedRoomId IS NOT NULL 
          AND r.status NOT IN ('cancelled', 'checked_out')
          AND (
            (r.checkInDate <= :checkIn AND r.checkOutDate > :checkIn) OR
            (r.checkInDate < :checkOut AND r.checkOutDate >= :checkOut) OR
            (r.checkInDate >= :checkIn AND r.checkOutDate <= :checkOut)
          )
        )
      `,
        { checkIn, checkOut },
      );
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

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['property', 'roomType', 'reservations', 'statusHistory'],
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create(createRoomDto);
    return await this.roomRepository.save(room);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(id);

    Object.assign(room, updateRoomDto);

    return await this.roomRepository.save(room);
  }

  async updateStatus(
    id: string,
    statusData: {
      operationalStatus?: 'available' | 'out_of_service';
      housekeepingStatus?: 'clean' | 'dirty' | 'inspected';
      housekeeperNotes?: string;
    },
  ): Promise<Room> {
    const room = await this.findOne(id);

    Object.assign(room, statusData);

    return await this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    await this.roomRepository.remove(room);
  }
}
