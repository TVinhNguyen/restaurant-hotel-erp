import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEvaluationsController } from './employee-evaluations.controller';
import { EmployeeEvaluationsService } from './employee-evaluations.service';
import { EmployeeEvaluation } from '../entities/hr/employee-evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEvaluation])],
  controllers: [EmployeeEvaluationsController],
  providers: [EmployeeEvaluationsService],
  exports: [EmployeeEvaluationsService],
})
export class EmployeeEvaluationsModule {}
