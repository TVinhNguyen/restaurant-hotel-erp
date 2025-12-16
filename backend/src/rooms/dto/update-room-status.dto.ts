import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';

export class UpdateRoomStatusDto {
  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động của phòng',
    enum: ['available', 'out_of_service'],
    example: 'available',
  })
  @IsOptional()
  @IsEnum(['available', 'out_of_service'])
  operationalStatus?: 'available' | 'out_of_service';

  @ApiPropertyOptional({
    description: 'Trạng thái vệ sinh phòng',
    enum: ['clean', 'dirty', 'inspected'],
    example: 'clean',
  })
  @IsOptional()
  @IsEnum(['clean', 'dirty', 'inspected'])
  housekeepingStatus?: 'clean' | 'dirty' | 'inspected';

  @ApiPropertyOptional({
    description: 'Ghi chú của nhân viên vệ sinh',
    example: 'Phòng đã được dọn dẹp và kiểm tra',
  })
  @IsOptional()
  @IsString()
  housekeeperNotes?: string;
}
