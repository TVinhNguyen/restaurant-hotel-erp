import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Property } from '../core/property.entity';
import { RoomType } from './room-type.entity';
import { RoomStatusHistory } from './room-status-history.entity';
import { Reservation } from '../reservation/reservation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'inventory', name: 'rooms' })
@Index(['propertyId', 'number'], { unique: true })
export class Room {
  @ApiProperty({ description: 'Unique identifier for the room' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the property this room belongs to' })
  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @ApiProperty({ description: 'ID of the room type' })
  @Column({ name: 'room_type_id', type: 'uuid' })
  roomTypeId: string;

  @ApiProperty({ description: 'Room number' })
  @Column({ length: 20 })
  number: string;

  @ApiProperty({ description: 'Floor number', required: false })
  @Column({ length: 20, nullable: true })
  floor: string;

  @ApiProperty({ description: 'View type', required: false })
  @Column({ name: 'view_type', length: 50, nullable: true })
  viewType: string;

  @ApiProperty({
    description: 'Operational status',
    enum: ['available', 'out_of_service'],
  })
  @Column({ name: 'operational_status', length: 20, default: 'available' })
  operationalStatus: 'available' | 'out_of_service';

  @ApiProperty({
    description: 'Housekeeping status',
    enum: ['clean', 'dirty', 'inspected'],
  })
  @Column({ name: 'housekeeping_status', length: 20, default: 'clean' })
  housekeepingStatus: 'clean' | 'dirty' | 'inspected';

  @ApiProperty({ description: 'Notes from housekeeper', required: false })
  @Column({ name: 'housekeeper_notes', type: 'text', nullable: true })
  housekeeperNotes: string;

  // Relations
  @ManyToOne(() => Property, (property) => property.rooms)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomType;

  @OneToMany(
    () => RoomStatusHistory,
    (roomStatusHistory) => roomStatusHistory.room,
  )
  statusHistory: RoomStatusHistory[];

  @OneToMany(() => Reservation, (reservation) => reservation.assignedRoom)
  reservations: Reservation[];
}
