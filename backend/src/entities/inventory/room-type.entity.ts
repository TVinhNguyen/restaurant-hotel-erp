import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Property } from '../core/property.entity';
import { RoomTypeAmenity } from './room-type-amenity.entity';
import { Photo } from './photo.entity';
import { Room } from './room.entity';
import { RatePlan } from '../reservation/rate-plan.entity';
import { Reservation } from '../reservation/reservation.entity';

@Entity({ schema: 'inventory', name: 'room_types' })
export class RoomType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'max_adults', type: 'int', nullable: true })
  maxAdults: number;

  @Column({ name: 'max_children', type: 'int', nullable: true })
  maxChildren: number;

  @Column({
    name: 'base_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  basePrice: number;

  @Column({ name: 'bed_type', length: 50, nullable: true })
  bedType: string;

  // Relations
  @ManyToOne(() => Property, (property) => property.roomTypes)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @OneToMany(
    () => RoomTypeAmenity,
    (roomTypeAmenity) => roomTypeAmenity.roomType,
  )
  roomTypeAmenities: RoomTypeAmenity[];

  @OneToMany(() => Photo, (photo) => photo.roomType)
  photos: Photo[];

  @OneToMany(() => Room, (room) => room.roomType)
  rooms: Room[];

  @OneToMany(() => RatePlan, (ratePlan) => ratePlan.roomType)
  ratePlans: RatePlan[];

  @OneToMany(() => Reservation, (reservation) => reservation.roomType)
  reservations: Reservation[];
}
