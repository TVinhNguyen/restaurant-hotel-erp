import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingShiftsController } from './working-shifts.controller';
import { WorkingShiftsService } from './working-shifts.service';
import { WorkingShift } from '../entities/hr/working-shift.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkingShift])],
  controllers: [WorkingShiftsController],
  providers: [WorkingShiftsService],
  exports: [WorkingShiftsService]
})
export class WorkingShiftsModule {}
