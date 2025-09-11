import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatePlansController } from './rate-plans.controller';
import { RatePlansService } from './rate-plans.service';
import { RatePlan } from '../entities/reservation/rate-plan.entity';
import { DailyRate } from '../entities/reservation/daily-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RatePlan, DailyRate])],
  controllers: [RatePlansController],
  providers: [RatePlansService],
  exports: [RatePlansService],
})
export class RatePlansModule {}