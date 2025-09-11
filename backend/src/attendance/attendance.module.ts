import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from '../entities/hr/attendance.entity';
import { Employee } from '../entities/core/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attendance,
      Employee,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}