import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoomTypeAmenity } from './room-type-amenity.entity';

@Entity({ schema: 'inventory', name: 'amenities' })
export class Amenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  category: 'room' | 'facility';

  // Relations
  @OneToMany(
    () => RoomTypeAmenity,
    (roomTypeAmenity) => roomTypeAmenity.amenity,
  )
  roomTypeAmenities: RoomTypeAmenity[];
}
