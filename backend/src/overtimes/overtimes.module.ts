import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OvertimesController } from './overtimes.controller';
import { OvertimesService } from './overtimes.service';
import { Overtime } from '../entities/hr/overtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Overtime])],
  controllers: [OvertimesController],
  providers: [OvertimesService],
  exports: [OvertimesService]
})
export class OvertimesModule {}
