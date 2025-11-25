import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from '../entities/reservation/property-service.entity';
import { PropertyServicesController } from './property-services.controller';
import { PropertyServicesService } from './property-services.service';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyService])],
  controllers: [PropertyServicesController],
  providers: [PropertyServicesService],
  exports: [PropertyServicesService],
})
export class PropertyServicesModule {}
