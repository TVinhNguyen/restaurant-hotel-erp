import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Property } from '../core/property.entity';
import { RestaurantArea } from './restaurant-area.entity';
import { RestaurantTable } from './restaurant-table.entity';

@Entity({ schema: 'restaurant', name: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 100, nullable: true })
  cuisine: string;

  @Column({ name: 'open_time', type: 'time', nullable: true })
  openTime: string;

  @Column({ name: 'close_time', type: 'time', nullable: true })
  closeTime: string;

  @Column({ name: 'max_capacity', type: 'int', nullable: true })
  maxCapacity: number;

  // Relations
  @ManyToOne(() => Property, (property) => property.restaurants)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @OneToMany(
    () => RestaurantArea,
    (restaurantArea) => restaurantArea.restaurant,
  )
  areas: RestaurantArea[];

  @OneToMany(
    () => RestaurantTable,
    (restaurantTable) => restaurantTable.restaurant,
  )
  tables: RestaurantTable[];
}
