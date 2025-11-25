import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationServicesController } from './reservation-services.controller';
import { ReservationServicesService } from './reservation-services.service';
import { ReservationService } from '../entities/reservation/reservation-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationService])],
  controllers: [ReservationServicesController],
  providers: [ReservationServicesService],
  exports: [ReservationServicesService],
})
export class ReservationServicesModule {}
