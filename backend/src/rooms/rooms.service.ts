import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/inventory/room.entity';
import { RoomStatusHistory } from '../entities/inventory/room-status-history.entity';
import { RoomMaintenance } from '../entities/inventory/room-maintenance.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomStatusHistory)
    private roomStatusHistoryRepository: Repository<RoomStatusHistory>,
    @InjectRepository(RoomMaintenance)
    private roomMaintenanceRepository: Repository<RoomMaintenance>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
    roomTypeId?: string;
    status?: string;
    floor?: string;
  }) {
    const { page = 1, limit = 10, propertyId, roomTypeId, status, floor } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roomRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.property', 'property')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('room.statusHistory', 'statusHistory')
      .leftJoinAndSelect('statusHistory.changedByEmployee', 'changedByEmployee')
      .orderBy('statusHistory.changedAt', 'DESC');

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

    const queryBuilder = this.roomRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.property', 'property')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .where('room.operationalStatus = :status', { status: 'available' });

    if (propertyId) {
      queryBuilder.andWhere('room.propertyId = :propertyId', { propertyId });
    }

    // Check for conflicting reservations if dates provided
    if (checkIn && checkOut) {
      queryBuilder.andWhere(`
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
      `, { checkIn, checkOut });
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

  async updateStatus(id: string, statusData: {
    operationalStatus?: 'available' | 'out_of_service';
    housekeepingStatus?: 'clean' | 'dirty' | 'inspected';
    housekeeperNotes?: string;
  }): Promise<Room> {
    const room = await this.findOne(id);
    
    Object.assign(room, statusData);
    
    return await this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    await this.roomRepository.remove(room);
  }

  async getAllStatusHistory(query: {
    roomId?: string;
    propertyId?: string;
    statusType?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 100, roomId, propertyId, statusType, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roomStatusHistoryRepository
      .createQueryBuilder('statusHistory')
      .leftJoinAndSelect('statusHistory.room', 'room')
      .leftJoinAndSelect('room.property', 'property')
      .leftJoinAndSelect('statusHistory.changedByEmployee', 'changedByEmployee')
      .orderBy('statusHistory.changedAt', 'DESC');

    if (roomId) {
      queryBuilder.andWhere('statusHistory.roomId = :roomId', { roomId });
    }

    if (propertyId) {
      queryBuilder.andWhere('room.propertyId = :propertyId', { propertyId });
    }

    if (statusType) {
      queryBuilder.andWhere('statusHistory.statusType = :statusType', { statusType });
    }

    if (dateFrom) {
      queryBuilder.andWhere('statusHistory.changedAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('statusHistory.changedAt <= :dateTo', { dateTo });
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

  async getAllMaintenance(query: {
    roomId?: string;
    propertyId?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 100, roomId, propertyId, status, priority } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roomMaintenanceRepository
      .createQueryBuilder('maintenance')
      .leftJoinAndSelect('maintenance.room', 'room')
      .leftJoinAndSelect('room.property', 'property')
      .orderBy('maintenance.reportedAt', 'DESC');

    if (roomId) {
      queryBuilder.andWhere('maintenance.roomId = :roomId', { roomId });
    }

    if (propertyId) {
      queryBuilder.andWhere('room.propertyId = :propertyId', { propertyId });
    }

    if (status) {
      queryBuilder.andWhere('maintenance.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('maintenance.priority = :priority', { priority });
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

  async createMaintenance(createMaintenanceDto: any) {
    const maintenance = this.roomMaintenanceRepository.create(createMaintenanceDto);
    const saved = await this.roomMaintenanceRepository.save(maintenance) as unknown as RoomMaintenance;
    
    // Fetch with relations
    const result = await this.roomMaintenanceRepository.findOne({
      where: { id: saved.id },
      relations: ['room', 'room.property'],
    });
    
    return result!;
  }

  async updateMaintenance(id: string, updateMaintenanceDto: any) {
    // Check if maintenance exists
    const existing = await this.roomMaintenanceRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Maintenance request with ID ${id} not found`);
    }

    // Update using TypeORM update method
    await this.roomMaintenanceRepository.update(id, updateMaintenanceDto);

    // Fetch and return the updated entity with relations
    const updated = await this.roomMaintenanceRepository.findOne({
      where: { id },
      relations: ['room', 'room.property'],
    });

    return updated!;
  }

  async deleteMaintenance(id: string): Promise<void> {
    const maintenance = await this.roomMaintenanceRepository.findOne({ where: { id } });
    
    if (!maintenance) {
      throw new NotFoundException(`Maintenance request with ID ${id} not found`);
    }

    await this.roomMaintenanceRepository.remove(maintenance);
  }
}