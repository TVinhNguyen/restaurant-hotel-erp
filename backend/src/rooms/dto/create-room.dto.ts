import { IsString, IsOptional, IsUUID, IsIn } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  roomTypeId: string;

  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  viewType?: string;

  @IsOptional()
  @IsIn(['available', 'out_of_service'])
  operationalStatus?: 'available' | 'out_of_service';

  @IsOptional()
  @IsIn(['clean', 'dirty', 'inspected'])
  housekeepingStatus?: 'clean' | 'dirty' | 'inspected';

  @IsOptional()
  @IsString()
  housekeeperNotes?: string;
}