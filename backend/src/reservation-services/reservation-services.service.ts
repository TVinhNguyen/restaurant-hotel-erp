import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationService } from '../entities/reservation/reservation-service.entity';
import { CreateReservationServiceDto } from './dto/create-reservation-service.dto';
import { UpdateReservationServiceDto } from './dto/update-reservation-service.dto';

@Injectable()
export class ReservationServicesService {
  constructor(
    @InjectRepository(ReservationService)
    private reservationServiceRepository: Repository<ReservationService>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    reservationId?: string;
    propertyServiceId?: string;
  }) {
    const { page = 1, limit = 10, reservationId, propertyServiceId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reservationServiceRepository.createQueryBuilder('reservationService')
      .leftJoinAndSelect('reservationService.reservation', 'reservation')
      .leftJoinAndSelect('reservationService.propertyService', 'propertyService')
      .leftJoinAndSelect('propertyService.service', 'service');

    if (reservationId) {
      queryBuilder.andWhere('reservationService.reservationId = :reservationId', { reservationId });
    }

    if (propertyServiceId) {
      queryBuilder.andWhere('reservationService.propertyServiceId = :propertyServiceId', { propertyServiceId });
    }

    const [data, total] = await queryBuilder
      .orderBy('reservationService.dateProvided', 'DESC')
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

  async findOne(id: string): Promise<ReservationService> {
    const reservationService = await this.reservationServiceRepository.findOne({
      where: { id },
      relations: ['reservation', 'propertyService', 'propertyService.service'],
    });

    if (!reservationService) {
      throw new NotFoundException(`Reservation service with ID ${id} not found`);
    }

    return reservationService;
  }

  async create(createReservationServiceDto: CreateReservationServiceDto): Promise<ReservationService> {
    // Create a new object with proper type conversion
    const entityData = {
      reservationId: createReservationServiceDto.reservationId,
      propertyServiceId: createReservationServiceDto.propertyServiceId,
      quantity: createReservationServiceDto.quantity,
      totalPrice: createReservationServiceDto.totalPrice,
      dateProvided: createReservationServiceDto.dateProvided ? 
        new Date(createReservationServiceDto.dateProvided) : undefined,
    };

    const reservationService = this.reservationServiceRepository.create(entityData);
    return await this.reservationServiceRepository.save(reservationService);
  }

  async update(id: string, updateReservationServiceDto: UpdateReservationServiceDto): Promise<ReservationService> {
    const reservationService = await this.findOne(id);
    
    // Update fields individually to handle type conversion
    if (updateReservationServiceDto.reservationId !== undefined) {
      reservationService.reservationId = updateReservationServiceDto.reservationId;
    }
    if (updateReservationServiceDto.propertyServiceId !== undefined) {
      reservationService.propertyServiceId = updateReservationServiceDto.propertyServiceId;
    }
    if (updateReservationServiceDto.quantity !== undefined) {
      reservationService.quantity = updateReservationServiceDto.quantity;
    }
    if (updateReservationServiceDto.totalPrice !== undefined) {
      reservationService.totalPrice = updateReservationServiceDto.totalPrice;
    }
    if (updateReservationServiceDto.dateProvided !== undefined) {
      reservationService.dateProvided = new Date(updateReservationServiceDto.dateProvided);
    }
    
    return await this.reservationServiceRepository.save(reservationService);
  }

  async remove(id: string): Promise<void> {
    const reservationService = await this.findOne(id);
    await this.reservationServiceRepository.remove(reservationService);
  }

  async findByReservation(reservationId: string): Promise<ReservationService[]> {
    return await this.reservationServiceRepository.find({
      where: { reservationId },
      relations: ['propertyService', 'propertyService.service'],
      order: { dateProvided: 'DESC' },
    });
  }

  async getTotalServiceAmount(reservationId: string): Promise<number> {
    const result = await this.reservationServiceRepository
      .createQueryBuilder('reservationService')
      .select('SUM(reservationService.totalPrice)', 'total')
      .where('reservationService.reservationId = :reservationId', { reservationId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getServiceStatistics(propertyId?: string, startDate?: string, endDate?: string) {
    const queryBuilder = this.reservationServiceRepository
      .createQueryBuilder('reservationService')
      .leftJoin('reservationService.propertyService', 'propertyService')
      .leftJoin('propertyService.service', 'service')
      .leftJoin('reservationService.reservation', 'reservation')
      .select([
        'service.name as serviceName',
        'COUNT(reservationService.id) as usage',
        'SUM(reservationService.totalPrice) as revenue',
        'AVG(reservationService.totalPrice) as avgPrice',
      ])
      .groupBy('service.id, service.name');

    if (propertyId) {
      queryBuilder.andWhere('propertyService.propertyId = :propertyId', { propertyId });
    }

    if (startDate) {
      queryBuilder.andWhere('reservationService.dateProvided >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('reservationService.dateProvided <= :endDate', { endDate });
    }

    return await queryBuilder.getRawMany();
  }
}
