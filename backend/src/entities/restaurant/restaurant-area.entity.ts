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
import { Restaurant } from './restaurant.entity';
import { RestaurantTable } from './restaurant-table.entity';

@Entity({ schema: 'restaurant', name: 'restaurant_areas' })
export class RestaurantArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'restaurant_id', type: 'uuid' })
  restaurantId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.areas)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @OneToMany(() => RestaurantTable, (restaurantTable) => restaurantTable.area)
  tables: RestaurantTable[];
}
