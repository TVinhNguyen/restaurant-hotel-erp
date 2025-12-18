import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Room } from '../entities/inventory/room.entity';
import { RoomStatusHistory } from '../entities/inventory/room-status-history.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomStatusHistory)
    private roomStatusHistoryRepository: Repository<RoomStatusHistory>,
    private readonly dataSource: DataSource,
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

  /**
   * Task 6: Update room status with history tracking
   */
  async updateStatus(
    id: string,
    statusData: {
      operationalStatus?: 'available' | 'out_of_service';
      housekeepingStatus?: 'clean' | 'dirty' | 'inspected';
      housekeeperNotes?: string;
      changedBy?: string;
    },
  ): Promise<Room> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const room = await queryRunner.manager.findOne(Room, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      // Track status changes
      if (
        statusData.operationalStatus &&
        statusData.operationalStatus !== room.operationalStatus
      ) {
        const operationalHistory = queryRunner.manager.create(
          RoomStatusHistory,
          {
            roomId: room.id,
            statusType: 'operational',
            status: statusData.operationalStatus,
            notes:
              statusData.housekeeperNotes ||
              `Status changed from ${room.operationalStatus} to ${statusData.operationalStatus}`,
            changedBy: statusData.changedBy,
          },
        );
        await queryRunner.manager.save(operationalHistory);
      }

      if (
        statusData.housekeepingStatus &&
        statusData.housekeepingStatus !== room.housekeepingStatus
      ) {
        const housekeepingHistory = queryRunner.manager.create(
          RoomStatusHistory,
          {
            roomId: room.id,
            statusType: 'housekeeping',
            status: statusData.housekeepingStatus,
            notes:
              statusData.housekeeperNotes ||
              `Status changed from ${room.housekeepingStatus} to ${statusData.housekeepingStatus}`,
            changedBy: statusData.changedBy,
          },
        );
        await queryRunner.manager.save(housekeepingHistory);
      }

      // Update room
      if (statusData.operationalStatus) {
        room.operationalStatus = statusData.operationalStatus;
      }
      if (statusData.housekeepingStatus) {
        room.housekeepingStatus = statusData.housekeepingStatus;
      }
      if (statusData.housekeeperNotes !== undefined) {
        room.housekeeperNotes = statusData.housekeeperNotes;
      }

      const savedRoom = await queryRunner.manager.save(room);

      await queryRunner.commitTransaction();

      return savedRoom;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get status history for a room
   */
  async getStatusHistory(
    id: string,
    query: {
      statusType?: 'operational' | 'housekeeping';
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const { statusType, dateFrom, dateTo, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    // Verify room exists
    await this.findOne(id);

    const queryBuilder = this.roomStatusHistoryRepository
      .createQueryBuilder('history')
      .where('history.roomId = :roomId', { roomId: id });

    if (statusType) {
      queryBuilder.andWhere('history.statusType = :statusType', { statusType });
    }

    if (dateFrom) {
      queryBuilder.andWhere('history.changedAt >= :dateFrom', {
        dateFrom: new Date(dateFrom),
      });
    }

    if (dateTo) {
      queryBuilder.andWhere('history.changedAt <= :dateTo', {
        dateTo: new Date(dateTo),
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('history.changedAt', 'DESC')
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

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    await this.roomRepository.remove(room);
  }
}
