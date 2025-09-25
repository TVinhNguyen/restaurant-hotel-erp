import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxRulesController } from './tax-rules.controller';
import { TaxRulesService } from './tax-rules.service';
import { TaxRule } from '../entities/reservation/tax-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxRule])],
  controllers: [TaxRulesController],
  providers: [TaxRulesService],
  exports: [TaxRulesService],
})
export class TaxRulesModule {}
