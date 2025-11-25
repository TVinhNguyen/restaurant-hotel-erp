import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion.dto';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
  @ApiPropertyOptional({
    description: 'Whether the promotion is currently active',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Active must be a boolean value' })
  active?: boolean;
}
