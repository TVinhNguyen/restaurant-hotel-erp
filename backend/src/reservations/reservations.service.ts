import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  In,
  EntityManager,
} from 'typeorm';
import { Reservation } from '../entities/reservation/reservation.entity';
import { Payment } from '../entities/reservation/payment.entity';
import { Room } from '../entities/inventory/room.entity';
import { RoomStatusHistory } from '../entities/inventory/room-status-history.entity';
import { DailyRate } from '../entities/reservation/daily-rate.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { MessagingQueues, MessagingService } from '../infra.messaging';
import { PromotionsService } from '../promotions/promotions.service';
import { TaxRulesService } from '../tax-rules/tax-rules.service';

/**
 * Interface for price calculation result
 */
export interface PriceCalculation {
  baseAmount: number;
  dailyRates: Array<{ date: string; price: number }>;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  serviceAmount: number;
  totalAmount: number;
  breakdown: {
    roomCharges: number;
    discount: number;
    subtotal: number;
    vat: number;
    serviceFee: number;
    grandTotal: number;
  };
}

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomStatusHistory)
    private roomStatusHistoryRepository: Repository<RoomStatusHistory>,
    @InjectRepository(DailyRate)
    private dailyRateRepository: Repository<DailyRate>,
    private readonly dataSource: DataSource,
    private readonly messagingService: MessagingService,
    private readonly promotionsService: PromotionsService,
    private readonly taxRulesService: TaxRulesService,
  ) {}

  /**
   * Get all reservations with filters
   * Task 1: Fixed checkInFrom and checkInTo filters with proper date handling
   */
  async findAll(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
    status?: string;
    checkInFrom?: string;
    checkInTo?: string;
    checkOutFrom?: string;
    checkOutTo?: string;
    guestId?: string;
    includeRelations?: boolean;
  }) {
    const {
      page = 1,
      limit = 10,
      propertyId,
      status,
      checkInFrom,
      checkInTo,
      checkOutFrom,
      checkOutTo,
      guestId,
      includeRelations = false,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.reservationRepository.createQueryBuilder('reservation');

    if (includeRelations) {
      queryBuilder
        .leftJoinAndSelect('reservation.property', 'property')
        .leftJoinAndSelect('reservation.guest', 'guest')
        .leftJoinAndSelect('reservation.roomType', 'roomType')
        .leftJoinAndSelect('reservation.assignedRoom', 'assignedRoom')
        .leftJoinAndSelect('reservation.ratePlan', 'ratePlan');
    } else {
      queryBuilder
        .select([
          'reservation.id',
          'reservation.confirmationCode',
          'reservation.checkIn',
          'reservation.checkOut',
          'reservation.status',
          'reservation.totalAmount',
          'reservation.paymentStatus',
          'reservation.createdAt',
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

    // Task 1: Improved date filtering with proper date parsing
    if (checkInFrom) {
      const fromDate = this.parseDate(checkInFrom);
      queryBuilder.andWhere('DATE(reservation.checkIn) >= DATE(:checkInFrom)', {
        checkInFrom: fromDate,
      });
    }

    if (checkInTo) {
      const toDate = this.parseDate(checkInTo);
      queryBuilder.andWhere('DATE(reservation.checkIn) <= DATE(:checkInTo)', {
        checkInTo: toDate,
      });
    }

    if (checkOutFrom) {
      const fromDate = this.parseDate(checkOutFrom);
      queryBuilder.andWhere(
        'DATE(reservation.checkOut) >= DATE(:checkOutFrom)',
        {
          checkOutFrom: fromDate,
        },
      );
    }

    if (checkOutTo) {
      const toDate = this.parseDate(checkOutTo);
      queryBuilder.andWhere('DATE(reservation.checkOut) <= DATE(:checkOutTo)', {
        checkOutTo: toDate,
      });
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

  /**
   * Create a new reservation with price calculation and availability check
   * Task 3: Booking Flow & Concurrency - Use transaction with pessimistic locking
   * Task 4: Final Price Calculation
   */
  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Task 3: Check room availability with locking to prevent double booking
      await this.checkRoomAvailability(
        createReservationDto.roomTypeId,
        createReservationDto.propertyId,
        createReservationDto.checkIn,
        createReservationDto.checkOut,
        createReservationDto.assignedRoomId,
        queryRunner,
      );

      // Task 4: Calculate final price if not provided
      let priceData = {
        totalAmount: createReservationDto.totalAmount,
        taxAmount: createReservationDto.taxAmount || 0,
        discountAmount: createReservationDto.discountAmount || 0,
        serviceAmount: createReservationDto.serviceAmount || 0,
      };

      // Auto-calculate price if totalAmount is 0 or not meaningful
      if (
        !createReservationDto.totalAmount ||
        createReservationDto.totalAmount === 0
      ) {
        const priceCalculation = await this.calculateFinalPrice(
          createReservationDto.ratePlanId,
          createReservationDto.propertyId,
          createReservationDto.checkIn,
          createReservationDto.checkOut,
          createReservationDto.promotionId,
        );
        priceData = {
          totalAmount: priceCalculation.totalAmount,
          taxAmount: priceCalculation.taxAmount,
          discountAmount: priceCalculation.discountAmount,
          serviceAmount: priceCalculation.serviceAmount,
        };
      }

      const confirmationCode = this.generateConfirmationNumber();

      const reservation = queryRunner.manager.create(Reservation, {
        ...createReservationDto,
        confirmationCode,
        status: 'confirmed',
        ...priceData,
      });

      const savedReservation = await queryRunner.manager.save(reservation);

      await queryRunner.commitTransaction();

      await this.publishReservationEvent(MessagingQueues.ReservationConfirmed, {
        reservationId: savedReservation.id,
        confirmationCode,
        propertyId: savedReservation.propertyId,
        guestId: savedReservation.guestId,
        checkIn: savedReservation.checkIn,
        checkOut: savedReservation.checkOut,
      });

      return savedReservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    // If dates or rate plan changed, recalculate price
    if (
      updateReservationDto.checkIn ||
      updateReservationDto.checkOut ||
      updateReservationDto.ratePlanId ||
      updateReservationDto.promotionId !== undefined
    ) {
      try {
        const priceCalculation = await this.calculateFinalPrice(
          updateReservationDto.ratePlanId || reservation.ratePlanId,
          reservation.propertyId,
          updateReservationDto.checkIn ||
            reservation.checkIn.toISOString().split('T')[0],
          updateReservationDto.checkOut ||
            reservation.checkOut.toISOString().split('T')[0],
          updateReservationDto.promotionId ?? reservation.promotionId,
        );

        updateReservationDto.totalAmount = priceCalculation.totalAmount;
        updateReservationDto.taxAmount = priceCalculation.taxAmount;
        updateReservationDto.discountAmount = priceCalculation.discountAmount;
        updateReservationDto.serviceAmount = priceCalculation.serviceAmount;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn(`Could not recalculate price: ${errorMessage}`);
      }
    }

    Object.assign(reservation, updateReservationDto);

    return await this.reservationRepository.save(reservation);
  }

  /**
   * Task 5: Check-in & Room Assignment Flow
   * Validates room availability, cleanliness, and assigns room
   */
  async checkIn(id: string, roomId?: string): Promise<Reservation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { id },
        relations: ['roomType', 'assignedRoom'],
      });

      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }

      if (reservation.status !== 'confirmed') {
        throw new BadRequestException(
          'Reservation must be confirmed to check in',
        );
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkInDate = new Date(reservation.checkIn);
      checkInDate.setHours(0, 0, 0, 0);

      if (checkInDate > today) {
        throw new BadRequestException('Cannot check in before check-in date');
      }

      // Task 5: Room assignment logic
      const assignedRoomId = roomId || reservation.assignedRoomId;

      if (assignedRoomId) {
        // Validate and lock the room
        const room = await queryRunner.manager.findOne(Room, {
          where: { id: assignedRoomId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!room) {
          throw new NotFoundException(
            `Room with ID ${assignedRoomId} not found`,
          );
        }

        // Check if room is available
        if (room.operationalStatus !== 'available') {
          throw new BadRequestException(
            `Room ${room.number} is out of service`,
          );
        }

        // Check if room is clean or inspected (ready for check-in)
        if (room.housekeepingStatus === 'dirty') {
          throw new BadRequestException(
            `Room ${room.number} is not clean. Please wait for housekeeping.`,
          );
        }

        // Check if room type matches
        if (room.roomTypeId !== reservation.roomTypeId) {
          throw new BadRequestException(
            `Room ${room.number} is not of the reserved room type`,
          );
        }

        // Check for conflicting reservations
        const conflictingReservation = await queryRunner.manager.findOne(
          Reservation,
          {
            where: {
              assignedRoomId: assignedRoomId,
              status: In(['confirmed', 'checked_in']),
              id: Not(id),
              checkIn: LessThanOrEqual(reservation.checkOut),
              checkOut: MoreThanOrEqual(reservation.checkIn),
            },
          },
        );

        if (conflictingReservation) {
          throw new ConflictException(
            `Room ${room.number} is already assigned to another reservation`,
          );
        }

        reservation.assignedRoomId = assignedRoomId;
      } else {
        // Auto-assign an available room
        const availableRoom = await this.findAvailableRoom(
          reservation.propertyId,
          reservation.roomTypeId,
          reservation.checkIn,
          reservation.checkOut,
          queryRunner,
        );

        if (!availableRoom) {
          throw new BadRequestException(
            'No available rooms for the requested room type. Please assign manually.',
          );
        }

        reservation.assignedRoomId = availableRoom.id;
      }

      reservation.status = 'checked_in';

      const savedReservation = await queryRunner.manager.save(reservation);

      await queryRunner.commitTransaction();

      await this.publishReservationEvent(MessagingQueues.ReservationCheckedIn, {
        reservationId: savedReservation.id,
        roomId: savedReservation.assignedRoomId,
        propertyId: savedReservation.propertyId,
        guestId: savedReservation.guestId,
        checkIn: savedReservation.checkIn,
      });

      return savedReservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Task 2 & 6: Check-out with payment creation and housekeeping lifecycle
   */
  async checkOut(
    id: string,
    paymentDetails?: {
      method?: 'cash' | 'card' | 'bank' | 'e_wallet' | 'ota_virtual';
      amount?: number;
      transactionId?: string;
      notes?: string;
    },
  ): Promise<Reservation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lock reservation without relations first
      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }

      if (reservation.status !== 'checked_in') {
        throw new BadRequestException(
          'Reservation must be checked in to check out',
        );
      }

      // Load payments separately
      const payments = await queryRunner.manager.find(Payment, {
        where: { reservationId: id },
      });

      // Task 2: Create payment if payment is successful and not already paid
      const totalPaid =
        payments?.reduce(
          (sum, p) => sum + (p.status === 'captured' ? Number(p.amount) : 0),
          0,
        ) || 0;
      const remainingAmount = Number(reservation.totalAmount) - totalPaid;

      if (remainingAmount > 0 && paymentDetails) {
        const paymentAmount = paymentDetails.amount || remainingAmount;

        const payment = queryRunner.manager.create(Payment, {
          reservationId: reservation.id,
          amount: paymentAmount,
          currency: reservation.currency,
          method: paymentDetails.method || 'cash',
          status: 'captured',
          transactionId:
            paymentDetails.transactionId || this.generateTransactionId(),
          notes: paymentDetails.notes || 'Payment at checkout',
        });

        await queryRunner.manager.save(payment);

        // Update reservation payment status
        const newTotalPaid = totalPaid + paymentAmount;
        if (newTotalPaid >= Number(reservation.totalAmount)) {
          reservation.paymentStatus = 'paid';
          reservation.amountPaid = Number(reservation.totalAmount);
        } else {
          reservation.paymentStatus = 'partial';
          reservation.amountPaid = newTotalPaid;
        }
      }

      // Task 6: Housekeeping Lifecycle - Set room to dirty on checkout
      if (reservation.assignedRoomId) {
        const room = await queryRunner.manager.findOne(Room, {
          where: { id: reservation.assignedRoomId },
          lock: { mode: 'pessimistic_write' },
        });

        if (room) {
          const previousStatus = room.housekeepingStatus;
          room.housekeepingStatus = 'dirty';
          await queryRunner.manager.save(room);

          // Create housekeeping status history
          const statusHistory = queryRunner.manager.create(RoomStatusHistory, {
            roomId: room.id,
            statusType: 'housekeeping',
            status: 'dirty',
            notes: `Auto-set to dirty on checkout from reservation ${reservation.confirmationCode}`,
          });
          await queryRunner.manager.save(statusHistory);

          this.logger.log(
            `Room ${room.number} status changed from ${previousStatus} to dirty on checkout`,
          );
        }
      }

      reservation.status = 'checked_out';

      const savedReservation = await queryRunner.manager.save(reservation);

      await queryRunner.commitTransaction();

      await this.publishReservationEvent(
        MessagingQueues.ReservationCheckedOut,
        {
          reservationId: savedReservation.id,
          propertyId: savedReservation.propertyId,
          guestId: savedReservation.guestId,
          checkOut: savedReservation.checkOut,
          roomId: savedReservation.assignedRoomId,
          paymentStatus: savedReservation.paymentStatus,
        },
      );

      return savedReservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Task 2: Complete reservation with payment
   */
  async completeWithPayment(
    id: string,
    paymentDto: {
      method: 'cash' | 'card' | 'bank' | 'e_wallet' | 'ota_virtual';
      amount: number;
      transactionId?: string;
      notes?: string;
    },
  ): Promise<{ reservation: Reservation; payment: Payment }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { id },
        relations: ['payments'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }

      // Create payment
      const payment = queryRunner.manager.create(Payment, {
        reservationId: reservation.id,
        amount: paymentDto.amount,
        currency: reservation.currency,
        method: paymentDto.method,
        status: 'captured',
        transactionId: paymentDto.transactionId || this.generateTransactionId(),
        notes: paymentDto.notes,
      });

      await queryRunner.manager.save(payment);

      // Update payment status
      const totalPaid =
        (reservation.payments?.reduce(
          (sum, p) => sum + (p.status === 'captured' ? Number(p.amount) : 0),
          0,
        ) || 0) + paymentDto.amount;

      if (totalPaid >= Number(reservation.totalAmount)) {
        reservation.paymentStatus = 'paid';
        reservation.amountPaid = Number(reservation.totalAmount);
      } else {
        reservation.paymentStatus = 'partial';
        reservation.amountPaid = totalPaid;
      }

      const savedReservation = await queryRunner.manager.save(reservation);

      await queryRunner.commitTransaction();

      return { reservation: savedReservation, payment };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async assignRoom(id: string, roomId: string): Promise<Reservation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }

      if (
        reservation.status === 'cancelled' ||
        reservation.status === 'checked_out'
      ) {
        throw new BadRequestException(
          'Cannot assign room to cancelled or checked out reservation',
        );
      }

      // Validate room
      const room = await queryRunner.manager.findOne(Room, {
        where: { id: roomId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} not found`);
      }

      if (room.operationalStatus !== 'available') {
        throw new BadRequestException(`Room ${room.number} is not available`);
      }

      if (room.roomTypeId !== reservation.roomTypeId) {
        throw new BadRequestException(
          `Room ${room.number} is not of the reserved room type`,
        );
      }

      // Check for conflicts
      const conflictingReservation = await queryRunner.manager.findOne(
        Reservation,
        {
          where: {
            assignedRoomId: roomId,
            status: In(['confirmed', 'checked_in']),
            id: Not(id),
            checkIn: LessThanOrEqual(reservation.checkOut),
            checkOut: MoreThanOrEqual(reservation.checkIn),
          },
        },
      );

      if (conflictingReservation) {
        throw new ConflictException(
          `Room ${room.number} is already assigned to another reservation for overlapping dates`,
        );
      }

      reservation.assignedRoomId = roomId;

      const savedReservation = await queryRunner.manager.save(reservation);

      await queryRunner.commitTransaction();

      return savedReservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(id: string, reason?: string): Promise<Reservation> {
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
      reason: reason || 'manual_cancel',
    });

    return savedReservation;
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }

  /**
   * Task 4: Calculate Final Price
   * Final Price = sum(Price on Day_i) - Discount + Tax + Service Fee
   */
  async calculateFinalPrice(
    ratePlanId: string,
    propertyId: string,
    checkIn: string,
    checkOut: string,
    promotionId?: string,
  ): Promise<PriceCalculation> {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Get daily rates for the stay period (excluding checkout date)
    const dailyRates = await this.dailyRateRepository
      .createQueryBuilder('dailyRate')
      .where('dailyRate.ratePlanId = :ratePlanId', { ratePlanId })
      .andWhere('dailyRate.date >= :checkIn', { checkIn: checkInDate })
      .andWhere('dailyRate.date < :checkOut', { checkOut: checkOutDate })
      .orderBy('dailyRate.date', 'ASC')
      .getMany();

    // Calculate base amount from daily rates
    let baseAmount = 0;
    const rateBreakdown: Array<{ date: string; price: number }> = [];

    // Generate all dates between check-in and check-out (excluding checkout date)
    const currentDate = new Date(checkInDate);
    while (currentDate < checkOutDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dailyRate = dailyRates.find((r) => {
        const rateDate = new Date(r.date).toISOString().split('T')[0];
        return rateDate === dateStr;
      });

      if (dailyRate) {
        const price = Number(dailyRate.price);
        baseAmount += price;
        rateBreakdown.push({ date: dateStr, price });
      } else {
        // If no daily rate found, log warning but continue
        this.logger.warn(
          `No daily rate found for ${dateStr} on rate plan ${ratePlanId}`,
        );
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate discount if promotion exists
    let discountAmount = 0;
    let discountPercent = 0;

    if (promotionId) {
      try {
        const discountResult = await this.promotionsService.calculateDiscount(
          baseAmount,
          promotionId,
        );
        discountAmount = discountResult.discountAmount;
        discountPercent = discountResult.discountPercent;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn(
          `Could not apply promotion ${promotionId}: ${errorMessage}`,
        );
      }
    }

    const subtotal = baseAmount - discountAmount;

    // Calculate taxes and service fees
    let taxAmount = 0;
    let serviceAmount = 0;

    try {
      const taxResult = await this.taxRulesService.calculateTax(
        subtotal,
        propertyId,
      );
      taxAmount = taxResult.vatAmount;
      serviceAmount = taxResult.serviceAmount;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Could not calculate tax: ${errorMessage}`);
    }

    const totalAmount = subtotal + taxAmount + serviceAmount;

    return {
      baseAmount,
      dailyRates: rateBreakdown,
      discountAmount,
      discountPercent,
      taxAmount,
      serviceAmount,
      totalAmount: Math.round(totalAmount * 100) / 100,
      breakdown: {
        roomCharges: baseAmount,
        discount: discountAmount,
        subtotal,
        vat: taxAmount,
        serviceFee: serviceAmount,
        grandTotal: Math.round(totalAmount * 100) / 100,
      },
    };
  }

  /**
   * Get price calculation for a potential reservation (quote)
   */
  async getPriceQuote(
    ratePlanId: string,
    propertyId: string,
    checkIn: string,
    checkOut: string,
    promotionCode?: string,
  ): Promise<PriceCalculation> {
    let promotionId: string | undefined;

    if (promotionCode) {
      try {
        const validation = await this.promotionsService.validatePromotion(
          promotionCode,
          propertyId,
        );
        if (validation.valid && validation.promotion) {
          promotionId = validation.promotion.id;
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn(`Promotion validation failed: ${errorMessage}`);
      }
    }

    return this.calculateFinalPrice(
      ratePlanId,
      propertyId,
      checkIn,
      checkOut,
      promotionId,
    );
  }

  /**
   * Task 3: Check room availability with concurrency control
   */
  private async checkRoomAvailability(
    roomTypeId: string,
    propertyId: string,
    checkIn: string,
    checkOut: string,
    assignedRoomId?: string,
    queryRunner?: { manager: EntityManager },
  ): Promise<void> {
    const manager: EntityManager =
      queryRunner?.manager || this.reservationRepository.manager;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (assignedRoomId) {
      // Check specific room
      const room = await manager.findOne(Room, {
        where: { id: assignedRoomId },
        lock: queryRunner ? { mode: 'pessimistic_write' } : undefined,
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${assignedRoomId} not found`);
      }

      if (room.operationalStatus !== 'available') {
        throw new BadRequestException(`Room ${room.number} is not available`);
      }

      // Check for conflicting reservations
      const conflict = await manager.findOne(Reservation, {
        where: {
          assignedRoomId,
          status: In(['confirmed', 'checked_in']),
          checkIn: LessThanOrEqual(checkOutDate),
          checkOut: MoreThanOrEqual(checkInDate),
        },
      });

      if (conflict) {
        throw new ConflictException(
          `Room is already booked for the selected dates (Reservation: ${conflict.confirmationCode})`,
        );
      }
    } else {
      // Check if any room of the type is available
      const rooms = await manager.find(Room, {
        where: {
          roomTypeId,
          propertyId,
          operationalStatus: 'available',
        },
      });

      if (rooms.length === 0) {
        throw new BadRequestException(
          'No rooms available for the selected room type',
        );
      }

      // Count reservations for the date range
      const reservationCount = await manager.count(Reservation, {
        where: {
          roomTypeId,
          propertyId,
          status: In(['confirmed', 'checked_in']),
          checkIn: LessThanOrEqual(checkOutDate),
          checkOut: MoreThanOrEqual(checkInDate),
        },
      });

      if (reservationCount >= rooms.length) {
        throw new ConflictException(
          'No rooms available for the selected dates. All rooms are booked.',
        );
      }
    }
  }

  /**
   * Find an available room for auto-assignment
   */
  private async findAvailableRoom(
    propertyId: string,
    roomTypeId: string,
    checkIn: Date,
    checkOut: Date,
    queryRunner: { manager: EntityManager },
  ): Promise<Room | null> {
    // Get all rooms of the type that are available and clean/inspected
    const rooms = await queryRunner.manager.find(Room, {
      where: {
        propertyId,
        roomTypeId,
        operationalStatus: 'available',
        housekeepingStatus: In(['clean', 'inspected']),
      },
      lock: { mode: 'pessimistic_write' },
    });

    for (const room of rooms) {
      // Check for conflicting reservations
      const conflict = await queryRunner.manager.findOne(Reservation, {
        where: {
          assignedRoomId: room.id,
          status: In(['confirmed', 'checked_in']),
          checkIn: LessThanOrEqual(checkOut),
          checkOut: MoreThanOrEqual(checkIn),
        },
      });

      if (!conflict) {
        return room;
      }
    }

    return null;
  }

  /**
   * Task 6: Update room housekeeping status with history
   */
  async updateRoomHousekeepingStatus(
    roomId: string,
    status: 'clean' | 'dirty' | 'inspected',
    notes?: string,
    changedBy?: string,
  ): Promise<Room> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const room = await queryRunner.manager.findOne(Room, {
        where: { id: roomId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} not found`);
      }

      const previousStatus = room.housekeepingStatus;
      room.housekeepingStatus = status;
      room.housekeeperNotes = notes || room.housekeeperNotes;

      await queryRunner.manager.save(room);

      // Create status history entry
      const statusHistory = queryRunner.manager.create(RoomStatusHistory, {
        roomId: room.id,
        statusType: 'housekeeping',
        status,
        notes: notes || `Status changed from ${previousStatus} to ${status}`,
        changedBy,
      });
      await queryRunner.manager.save(statusHistory);

      await queryRunner.commitTransaction();

      return room;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Helper: Parse date string safely
   */
  private parseDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date format: ${dateString}`);
    }
    return date;
  }

  private generateConfirmationNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `RES${timestamp.slice(-6)}${random}`;
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN${timestamp.slice(-8)}${random}`;
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
