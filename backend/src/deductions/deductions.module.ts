import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeductionsController } from './deductions.controller';
import { DeductionsService } from './deductions.service';
import { Deduction } from '../entities/hr/deduction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deduction])],
  controllers: [DeductionsController],
  providers: [DeductionsService],
  exports: [DeductionsService],
})
export class DeductionsModule {}
