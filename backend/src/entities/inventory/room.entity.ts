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

@Entity({ schema: 'inventory', name: 'rooms' })
@Index(['propertyId', 'number'], { unique: true })
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ name: 'room_type_id', type: 'uuid' })
  roomTypeId: string;

  @Column({ length: 20 })
  number: string;

  @Column({ length: 20, nullable: true })
  floor: string;

  @Column({ name: 'view_type', length: 50, nullable: true })
  viewType: string;

  @Column({ name: 'operational_status', length: 20, default: 'available' })
  operationalStatus: 'available' | 'out_of_service';

  @Column({ name: 'housekeeping_status', length: 20, default: 'clean' })
  housekeepingStatus: 'clean' | 'dirty' | 'inspected';

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
