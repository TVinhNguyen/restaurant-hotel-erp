import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationServiceDto } from './create-reservation-service.dto';

export class UpdateReservationServiceDto extends PartialType(
  CreateReservationServiceDto,
) {}
