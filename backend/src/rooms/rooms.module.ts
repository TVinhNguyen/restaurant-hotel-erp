import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room } from '../entities/inventory/room.entity';
import { RoomStatusHistory } from '../entities/inventory/room-status-history.entity';
import { RoomMaintenance } from '../entities/inventory/room-maintenance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomStatusHistory, RoomMaintenance])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}