import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantArea } from './restaurant-area.entity';
import { TableBooking } from './table-booking.entity';

@Entity({ schema: 'restaurant', name: 'restaurant_tables' })
@Index(['restaurantId', 'tableNumber'], { unique: true })
export class RestaurantTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'restaurant_id', type: 'uuid' })
  restaurantId: string;

  @Column({ name: 'area_id', type: 'uuid', nullable: true })
  areaId: string;

  @Column({ name: 'table_number', length: 20 })
  tableNumber: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ length: 20, default: 'available' })
  status: 'available' | 'occupied' | 'reserved';

  // @CreateDateColumn({ name: 'created_at' })
  // createdAt: Date;

  // @UpdateDateColumn({ name: 'updated_at' })
  // updatedAt: Date;

  // Relations
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne(() => RestaurantArea, (area) => area.tables, { nullable: true })
  @JoinColumn({ name: 'area_id' })
  area: RestaurantArea;

  @OneToMany(() => TableBooking, (tableBooking) => tableBooking.assignedTable)
  bookings: TableBooking[];
}
