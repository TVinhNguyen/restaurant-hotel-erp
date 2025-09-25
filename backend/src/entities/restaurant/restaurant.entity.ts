import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from '../core/property.entity';
import { RestaurantArea } from './restaurant-area.entity';
import { RestaurantTable } from './restaurant-table.entity';
import { TableBooking } from './table-booking.entity';

@Entity({ schema: 'restaurant', name: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ name: 'opening_hours', length: 100, nullable: true })
  openingHours: string;

  @Column({ name: 'cuisine_type', length: 50, nullable: true })
  cuisineType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Property, (property) => property.restaurants)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @OneToMany(() => RestaurantArea, (restaurantArea) => restaurantArea.restaurant)
  areas: RestaurantArea[];

  @OneToMany(() => RestaurantTable, (restaurantTable) => restaurantTable.restaurant)
  tables: RestaurantTable[];

  @OneToMany(() => TableBooking, (booking) => booking.restaurant)
  bookings: TableBooking[];
}
