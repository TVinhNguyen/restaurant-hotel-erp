import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from '../entities/hr/attendance.entity';
import { Employee } from '../entities/core/employee.entity';
import { WorkingShift } from '../entities/hr/working-shift.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Employee, WorkingShift])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
