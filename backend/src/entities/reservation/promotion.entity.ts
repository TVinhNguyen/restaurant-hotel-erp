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

  @Column({ length: 100 })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'discount_type', length: 20 })
  discountType: 'percentage' | 'fixed_amount';

  @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ name: 'valid_from', type: 'date' })
  validFrom: Date;

  @Column({ name: 'valid_to', type: 'date' })
  validTo: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Property, (property) => property.promotions)
  @JoinColumn({ name: 'property_id' })
  property: Property;
}
