import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { Payroll } from '../entities/hr/payroll.entity';
import { Employee } from '../entities/core/employee.entity';
import { Overtime } from '../entities/hr/overtime.entity';
import { Deduction } from '../entities/hr/deduction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payroll, Employee, Overtime, Deduction])],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
