import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { Leave } from '../entities/hr/leave.entity';
import { Employee } from '../entities/core/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Leave,
      Employee,
    ]),
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}