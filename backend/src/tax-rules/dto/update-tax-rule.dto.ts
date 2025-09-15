import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxRuleDto } from './create-tax-rule.dto';

export class UpdateTaxRuleDto extends PartialType(CreateTaxRuleDto) {}
