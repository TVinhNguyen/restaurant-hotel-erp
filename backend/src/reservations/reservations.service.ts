import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
    status?: string;
    checkInFrom?: string;
    checkInTo?: string;
    guestId?: string;
  }) {
    const { page = 1, limit = 10, propertyId, status, checkInFrom, checkInTo, guestId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reservationRepository.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.property', 'property')
      .leftJoinAndSelect('reservation.guest', 'guest')
      .leftJoinAndSelect('reservation.roomType', 'roomType')
      .leftJoinAndSelect('reservation.assignedRoom', 'assignedRoom')
      .leftJoinAndSelect('reservation.ratePlan', 'ratePlan');

    if (propertyId) {
      queryBuilder.andWhere('reservation.propertyId = :propertyId', { propertyId });
    }

    if (status) {
      queryBuilder.andWhere('reservation.status = :status', { status });
    }

    if (guestId) {
      queryBuilder.andWhere('reservation.guestId = :guestId', { guestId });
    }

    if (checkInFrom) {
      queryBuilder.andWhere('reservation.checkInDate >= :checkInFrom', { checkInFrom });
    }

    if (checkInTo) {
      queryBuilder.andWhere('reservation.checkInDate <= :checkInTo', { checkInTo });
    }

    const [data, total] = await queryBuilder
      .orderBy('reservation.checkInDate', 'DESC')
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

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['property', 'guest', 'roomType', 'assignedRoom', 'ratePlan', 'payments'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    // Generate confirmation number
    const confirmationNumber = this.generateConfirmationNumber();
    
    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      confirmationNumber,
      status: 'confirmed',
    });

    return await this.reservationRepository.save(reservation);
  }

  async update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    Object.assign(reservation, updateReservationDto);
    
    return await this.reservationRepository.save(reservation);
  }

  async checkIn(id: string, roomId?: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== 'confirmed') {
      throw new BadRequestException('Reservation must be confirmed to check in');
    }

    const today = new Date().toISOString().split('T')[0];
    const checkInDate = reservation.checkInDate.toISOString().split('T')[0];

    if (checkInDate > today) {
      throw new BadRequestException('Cannot check in before check-in date');
    }

    reservation.status = 'checked_in';
    
    if (roomId) {
      reservation.assignedRoomId = roomId;
    }

    return await this.reservationRepository.save(reservation);
  }

  async checkOut(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== 'checked_in') {
      throw new BadRequestException('Reservation must be checked in to check out');
    }

    reservation.status = 'checked_out';

    return await this.reservationRepository.save(reservation);
  }

  async assignRoom(id: string, roomId: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status === 'cancelled' || reservation.status === 'checked_out') {
      throw new BadRequestException('Cannot assign room to cancelled or checked out reservation');
    }

    reservation.assignedRoomId = roomId;

    return await this.reservationRepository.save(reservation);
  }

  async cancel(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status === 'checked_in' || reservation.status === 'checked_out') {
      throw new BadRequestException('Cannot cancel checked in or checked out reservation');
    }

    reservation.status = 'cancelled';

    return await this.reservationRepository.save(reservation);
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }

  private generateConfirmationNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `RES${timestamp.slice(-6)}${random}`;
  }
}