import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoomType } from './room-type.entity';

@Entity({ schema: 'inventory', name: 'photos' })
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'room_type_id', type: 'uuid' })
  roomTypeId: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', nullable: true })
  caption: string;

  // Relations
  @ManyToOne(() => RoomType, (roomType) => roomType.photos)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomType;
}
