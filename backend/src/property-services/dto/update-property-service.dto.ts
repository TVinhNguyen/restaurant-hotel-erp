import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyServiceDto } from './create-property-service.dto';

export class UpdatePropertyServiceDto extends PartialType(
  CreatePropertyServiceDto,
) {}
