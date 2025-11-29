import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ArrayMinSize } from 'class-validator';

export class BulkAssignPermissionsDto {
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001'],
    description: 'Array of permission IDs to assign',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
