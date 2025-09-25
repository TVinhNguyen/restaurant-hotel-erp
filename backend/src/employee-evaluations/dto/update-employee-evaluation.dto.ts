import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeEvaluationDto } from './create-employee-evaluation.dto';

export class UpdateEmployeeEvaluationDto extends PartialType(
  CreateEmployeeEvaluationDto
) {}
