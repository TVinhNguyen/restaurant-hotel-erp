import { PartialType } from '@nestjs/mapped-types';
import { CreateRatePlanDto } from './create-rate-plan.dto';

export class UpdateRatePlanDto extends PartialType(CreateRatePlanDto) {}