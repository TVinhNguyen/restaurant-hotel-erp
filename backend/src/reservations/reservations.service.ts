import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { MessagingQueues, MessagingService } from '../infra.messaging';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private readonly messagingService: MessagingService,
    private readonly promotionsService: PromotionsService,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
    status?: string;
    checkInFrom?: string;
    checkInTo?: string;
    guestId?: string;
    includeRelations?: boolean; // Allow selective loading
  }) {
    const {
      page = 1,
      limit = 10,
      propertyId,
      status,
      checkInFrom,
      checkInTo,
      guestId,
      includeRelations = false, // Default to false for performance
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.reservationRepository.createQueryBuilder('reservation');

    // Only load relations if explicitly requested
    if (includeRelations) {
      queryBuilder
        .leftJoinAndSelect('reservation.property', 'property')
        .leftJoinAndSelect('reservation.guest', 'guest')
        .leftJoinAndSelect('reservation.roomType', 'roomType')
        .leftJoinAndSelect('reservation.assignedRoom', 'assignedRoom')
        .leftJoinAndSelect('reservation.ratePlan', 'ratePlan');
    } else {
      // For list view, only select necessary fields
      queryBuilder
        .select([
          'reservation.id',
          'reservation.confirmationCode',
          'reservation.checkIn',
          'reservation.checkOut',
          'reservation.status',
          'reservation.totalAmount',
          'reservation.createdAt',
          // Add minimal guest info for list display
          'guest.id',
          'guest.name',
          'guest.email',
        ])
        .leftJoin('reservation.guest', 'guest');
    }

    if (propertyId) {
      queryBuilder.andWhere('reservation.propertyId = :propertyId', {
        propertyId,
      });
    }

    if (status) {
      queryBuilder.andWhere('reservation.status = :status', { status });
    }

    if (guestId) {
      queryBuilder.andWhere('reservation.guestId = :guestId', { guestId });
    }

    if (checkInFrom) {
      queryBuilder.andWhere('reservation.checkIn >= :checkInFrom', {
        checkInFrom,
      });
    }

    if (checkInTo) {
      queryBuilder.andWhere('reservation.checkIn <= :checkInTo', { checkInTo });
    }

    const [data, total] = await queryBuilder
      .orderBy('reservation.checkIn', 'DESC')
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

  async findOne(id: string, includePayments = false): Promise<Reservation> {
    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.property', 'property')
      .leftJoinAndSelect('reservation.guest', 'guest')
      .leftJoinAndSelect('reservation.roomType', 'roomType')
      .leftJoinAndSelect('reservation.assignedRoom', 'assignedRoom')
      .leftJoinAndSelect('reservation.ratePlan', 'ratePlan')
      .where('reservation.id = :id', { id });

    // Only load payments if explicitly needed (they can be heavy)
    if (includePayments) {
      queryBuilder.leftJoinAndSelect('reservation.payments', 'payments');
    }

    const reservation = await queryBuilder.getOne();

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    // Generate confirmation number
    const confirmationCode = this.generateConfirmationNumber();

    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      confirmationCode,
      status: 'confirmed',
    });

    const savedReservation = await this.reservationRepository.save(reservation);
    await this.publishReservationEvent(MessagingQueues.ReservationConfirmed, {
      reservationId: savedReservation.id,
      confirmationCode,
      propertyId: savedReservation.propertyId,
      guestId: savedReservation.guestId,
      checkIn: savedReservation.checkIn,
      checkOut: savedReservation.checkOut,
    });

    return savedReservation;
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    Object.assign(reservation, updateReservationDto);

    return await this.reservationRepository.save(reservation);
  }

  async checkIn(id: string, roomId?: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== 'confirmed') {
      throw new BadRequestException(
        'Reservation must be confirmed to check in',
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const checkInDate = reservation.checkIn.toISOString().split('T')[0];

    if (checkInDate > today) {
      throw new BadRequestException('Cannot check in before check-in date');
    }

    reservation.status = 'checked_in';

    if (roomId) {
      reservation.assignedRoomId = roomId;
    }

    const savedReservation = await this.reservationRepository.save(reservation);
    await this.publishReservationEvent(MessagingQueues.ReservationCheckedIn, {
      reservationId: savedReservation.id,
      roomId: savedReservation.assignedRoomId,
      propertyId: savedReservation.propertyId,
      guestId: savedReservation.guestId,
      checkIn: savedReservation.checkIn,
    });

    return savedReservation;
  }

  async checkOut(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== 'checked_in') {
      throw new BadRequestException(
        'Reservation must be checked in to check out',
      );
    }

    reservation.status = 'checked_out';

    const savedReservation = await this.reservationRepository.save(reservation);
    await this.publishReservationEvent(MessagingQueues.ReservationCheckedOut, {
      reservationId: savedReservation.id,
      propertyId: savedReservation.propertyId,
      guestId: savedReservation.guestId,
      checkOut: savedReservation.checkOut,
    });

    return savedReservation;
  }

  async assignRoom(id: string, roomId: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (
      reservation.status === 'cancelled' ||
      reservation.status === 'checked_out'
    ) {
      throw new BadRequestException(
        'Cannot assign room to cancelled or checked out reservation',
      );
    }

    reservation.assignedRoomId = roomId;

    return await this.reservationRepository.save(reservation);
  }

  async cancel(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (
      reservation.status === 'checked_in' ||
      reservation.status === 'checked_out'
    ) {
      throw new BadRequestException(
        'Cannot cancel checked in or checked out reservation',
      );
    }

    reservation.status = 'cancelled';

    const savedReservation = await this.reservationRepository.save(reservation);
    await this.publishReservationEvent(MessagingQueues.ReservationCancelled, {
      reservationId: savedReservation.id,
      propertyId: savedReservation.propertyId,
      guestId: savedReservation.guestId,
      reason: 'manual_cancel',
    });

    return savedReservation;
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

  private async publishReservationEvent(
    queue: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    try {
      const published = await this.messagingService.publish(queue, payload);
      if (!published) {
        this.logger.warn(
          `Messaging channel not ready. Failed to enqueue event for ${queue}`,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to publish event ${queue}: ${message}`);
    }
  }
}
