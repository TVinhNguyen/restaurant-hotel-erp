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

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rate: number;

  @Column({ length: 20 })
  type: 'VAT' | 'service';

  // Relations
  @ManyToOne(() => Property, (property) => property.taxRules)
  @JoinColumn({ name: 'property_id' })
  property: Property;
}
