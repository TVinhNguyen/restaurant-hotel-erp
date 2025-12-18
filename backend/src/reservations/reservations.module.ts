import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from '../entities/reservation/reservation.entity';
import { Payment } from '../entities/reservation/payment.entity';
import { Room } from '../entities/inventory/room.entity';
import { RoomStatusHistory } from '../entities/inventory/room-status-history.entity';
import { DailyRate } from '../entities/reservation/daily-rate.entity';
import { PromotionsModule } from '../promotions/promotions.module';
import { TaxRulesModule } from '../tax-rules/tax-rules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Payment,
      Room,
      RoomStatusHistory,
      DailyRate,
    ]),
    PromotionsModule,
    TaxRulesModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
