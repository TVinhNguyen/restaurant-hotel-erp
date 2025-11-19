import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RoomType } from './room-type.entity';
import { Amenity } from './amenity.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'inventory', name: 'room_type_amenities' })
export class RoomTypeAmenity {
  @ApiProperty({ description: 'ID of the room type' })
  @PrimaryColumn({ name: 'room_type_id', type: 'uuid' })
  roomTypeId: string;

  @ApiProperty({ description: 'ID of the amenity' })
  @PrimaryColumn({ name: 'amenity_id', type: 'uuid' })
  amenityId: string;

  // Relations
  @ManyToOne(() => RoomType, (roomType) => roomType.roomTypeAmenities)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomType;

  @ManyToOne(() => Amenity, (amenity) => amenity.roomTypeAmenities)
  @JoinColumn({ name: 'amenity_id' })
  amenity: Amenity;
}
