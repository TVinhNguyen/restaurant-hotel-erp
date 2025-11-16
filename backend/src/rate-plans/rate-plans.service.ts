import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatePlan } from '../entities/reservation/rate-plan.entity';
import { DailyRate } from '../entities/reservation/daily-rate.entity';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';

@Injectable()
export class RatePlansService {
  constructor(
    @InjectRepository(RatePlan)
    private ratePlanRepository: Repository<RatePlan>,
    @InjectRepository(DailyRate)
    private dailyRateRepository: Repository<DailyRate>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
    roomTypeId?: string;
  }) {
    const { page = 1, limit = 10, propertyId, roomTypeId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.ratePlanRepository
      .createQueryBuilder('ratePlan')
      .leftJoinAndSelect('ratePlan.property', 'property')
      .leftJoinAndSelect('ratePlan.roomType', 'roomType');

    if (propertyId) {
      queryBuilder.andWhere('ratePlan.propertyId = :propertyId', {
        propertyId,
      });
    }

    if (roomTypeId) {
      queryBuilder.andWhere('ratePlan.roomTypeId = :roomTypeId', {
        roomTypeId,
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
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<RatePlan> {
    const ratePlan = await this.ratePlanRepository.findOne({
      where: { id },
      relations: ['property', 'roomType', 'dailyRates'],
    });

    if (!ratePlan) {
      throw new NotFoundException(`Rate plan with ID ${id} not found`);
    }

    return ratePlan;
  }

  async create(createRatePlanDto: CreateRatePlanDto): Promise<RatePlan> {
    const ratePlan = this.ratePlanRepository.create({
      ...createRatePlanDto,
      isRefundable: createRatePlanDto.isRefundable ?? true,
    });

    return await this.ratePlanRepository.save(ratePlan);
  }

  async update(
    id: string,
    updateRatePlanDto: UpdateRatePlanDto,
  ): Promise<RatePlan> {
    const ratePlan = await this.findOne(id);

    Object.assign(ratePlan, updateRatePlanDto);

    return await this.ratePlanRepository.save(ratePlan);
  }

  async remove(id: string): Promise<void> {
    const ratePlan = await this.findOne(id);
    await this.ratePlanRepository.remove(ratePlan);
  }

  async setDailyRate(
    ratePlanId: string,
    date: string,
    rate: number,
  ): Promise<DailyRate> {
    // Check if daily rate already exists for this date
    const existingRate = await this.dailyRateRepository.findOne({
      where: { ratePlanId, date: new Date(date) },
    });

    if (existingRate) {
      existingRate.price = rate;
      return await this.dailyRateRepository.save(existingRate);
    }

    const dailyRate = this.dailyRateRepository.create({
      ratePlanId,
      date: new Date(date),
      price: rate,
    });

    return await this.dailyRateRepository.save(dailyRate);
  }

  async getDailyRates(
    ratePlanId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.dailyRateRepository
      .createQueryBuilder('dailyRate')
      .where('dailyRate.ratePlanId = :ratePlanId', { ratePlanId });

    if (startDate) {
      queryBuilder.andWhere('dailyRate.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('dailyRate.date <= :endDate', { endDate });
    }

    return await queryBuilder.orderBy('dailyRate.date', 'ASC').getMany();
  }
}
