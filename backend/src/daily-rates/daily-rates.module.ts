import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyRatesController } from './daily-rates.controller';
import { DailyRatesService } from './daily-rates.service';
import { DailyRate } from '../entities/reservation/daily-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyRate])],
  controllers: [DailyRatesController],
  providers: [DailyRatesService],
  exports: [DailyRatesService],
})
export class DailyRatesModule {}
