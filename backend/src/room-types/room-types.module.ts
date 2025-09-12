import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypesController } from './room-types.controller';
import { RoomTypesService } from './room-types.service';
import { RoomType } from '../entities/inventory/room-type.entity';
import { RoomTypeAmenity } from '../entities/inventory/room-type-amenity.entity';
import { Amenity } from '../entities/inventory/amenity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType, RoomTypeAmenity, Amenity])],
  controllers: [RoomTypesController],
  providers: [RoomTypesService],
  exports: [RoomTypesService],
})
export class RoomTypesModule {}