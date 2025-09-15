import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from '../core/property.entity';

@Entity({ schema: 'reservation', name: 'promotions' })
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2 })
  discountPercent: number;

  @Column({ name: 'valid_from', type: 'date', nullable: true })
  validFrom: Date;

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo: Date;

  // Relations
  @ManyToOne(() => Property, (property) => property.promotions)
  @JoinColumn({ name: 'property_id' })
  property: Property;
}
