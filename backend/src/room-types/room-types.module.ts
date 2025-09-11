import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypesController } from './room-types.controller';
import { RoomTypesService } from './room-types.service';
import { RoomType } from '../entities/inventory/room-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType])],
  controllers: [RoomTypesController],
  providers: [RoomTypesService],
  exports: [RoomTypesService],
})
export class RoomTypesModule {}