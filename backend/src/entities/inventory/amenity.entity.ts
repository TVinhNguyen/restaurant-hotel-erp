import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoomTypeAmenity } from './room-type-amenity.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'inventory', name: 'amenities' })
export class Amenity {
  @ApiProperty({ description: 'Unique identifier for the amenity' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the amenity' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Category of the amenity', enum: ['room', 'facility'] })
  @Column({ length: 50 })
  category: 'room' | 'facility';

  // Relations
  @OneToMany(
    () => RoomTypeAmenity,
    (roomTypeAmenity) => roomTypeAmenity.amenity,
  )
  roomTypeAmenities: RoomTypeAmenity[];
}
