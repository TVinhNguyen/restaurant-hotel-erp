import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { PropertyService } from '../entities/reservation/property-service.entity';
import { Service } from '../entities/reservation/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyService, Service])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}