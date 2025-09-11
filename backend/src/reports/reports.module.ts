import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Reservation } from '../entities/reservation/reservation.entity';
import { Payment } from '../entities/reservation/payment.entity';
import { TableBooking } from '../entities/restaurant/table-booking.entity';
import { Room } from '../entities/inventory/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Payment,
      TableBooking,
      Room,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}