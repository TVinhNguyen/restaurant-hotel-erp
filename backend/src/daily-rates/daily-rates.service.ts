import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyRate } from '../entities/reservation/daily-rate.entity';
import { CreateDailyRateDto } from './dto/create-daily-rate.dto';
import { UpdateDailyRateDto } from './dto/update-daily-rate.dto';

@Injectable()
export class DailyRatesService {
  constructor(
    @InjectRepository(DailyRate)
    private dailyRateRepository: Repository<DailyRate>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    ratePlanId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { page = 1, limit = 10, ratePlanId, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.dailyRateRepository.createQueryBuilder('dailyRate')
      .leftJoinAndSelect('dailyRate.ratePlan', 'ratePlan');

    if (ratePlanId) {
      queryBuilder.andWhere('dailyRate.ratePlanId = :ratePlanId', { ratePlanId });
    }

    if (startDate) {
      queryBuilder.andWhere('dailyRate.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('dailyRate.date <= :endDate', { endDate });
    }

    const [data, total] = await queryBuilder
      .orderBy('dailyRate.date', 'ASC')
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

  async findOne(id: string): Promise<DailyRate> {
    const dailyRate = await this.dailyRateRepository.findOne({
      where: { id },
      relations: ['ratePlan'],
    });

    if (!dailyRate) {
      throw new NotFoundException(`Daily rate with ID ${id} not found`);
    }

    return dailyRate;
  }

  async create(createDailyRateDto: CreateDailyRateDto): Promise<DailyRate> {
    const dailyRate = this.dailyRateRepository.create({
      ...createDailyRateDto,
      date: new Date(createDailyRateDto.date),
    });

    return await this.dailyRateRepository.save(dailyRate);
  }

  async update(id: string, updateDailyRateDto: UpdateDailyRateDto): Promise<DailyRate> {
    const dailyRate = await this.findOne(id);
    
    if (updateDailyRateDto.date) {
      updateDailyRateDto.date = new Date(updateDailyRateDto.date).toISOString();
    }
    
    Object.assign(dailyRate, updateDailyRateDto);
    
    return await this.dailyRateRepository.save(dailyRate);
  }

  async remove(id: string): Promise<void> {
    const dailyRate = await this.findOne(id);
    await this.dailyRateRepository.remove(dailyRate);
  }

  async findByRatePlanAndDateRange(ratePlanId: string, startDate: string, endDate: string): Promise<DailyRate[]> {
    const queryBuilder = this.dailyRateRepository.createQueryBuilder('dailyRate')
      .where('dailyRate.ratePlanId = :ratePlanId', { ratePlanId });

    if (startDate && endDate) {
      queryBuilder.andWhere('dailyRate.date BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    return await queryBuilder
      .orderBy('dailyRate.date', 'ASC')
      .getMany();
  }
}
