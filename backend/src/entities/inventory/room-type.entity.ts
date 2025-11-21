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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'inventory', name: 'room_types' })
export class RoomType {
  @ApiProperty({ description: 'Unique identifier for the room type' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the property this room type belongs to' })
  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @ApiProperty({ description: 'Name of the room type' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Description of the room type', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Maximum number of adults', required: false })
  @Column({ name: 'max_adults', type: 'int', nullable: true })
  maxAdults: number;

  @ApiProperty({ description: 'Maximum number of children', required: false })
  @Column({ name: 'max_children', type: 'int', nullable: true })
  maxChildren: number;

  @ApiProperty({ description: 'Base price for the room type', required: false })
  @Column({
    name: 'base_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  basePrice: number;

  @ApiProperty({ description: 'Type of bed', required: false })
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
