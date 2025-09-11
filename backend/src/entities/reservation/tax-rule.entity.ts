import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from '../core/property.entity';

@Entity({ schema: 'reservation', name: 'tax_rules' })
export class TaxRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ name: 'tax_name', length: 100 })
  taxName: string;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2 })
  taxRate: number;

  @Column({ name: 'is_inclusive', default: false })
  isInclusive: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Property, (property) => property.taxRules)
  @JoinColumn({ name: 'property_id' })
  property: Property;
}
