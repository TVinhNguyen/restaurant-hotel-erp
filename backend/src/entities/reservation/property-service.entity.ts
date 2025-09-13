import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Property } from '../core/property.entity';
import { Service } from './service.entity';
import { ReservationService } from './reservation-service.entity';

@Entity({ schema: 'reservation', name: 'property_services' })
export class PropertyService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ length: 10 })
  currency: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Property, (property) => property.propertyServices)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => Service, (service) => service.propertyServices)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @OneToMany(() => ReservationService, (reservationService) => reservationService.propertyService)
  reservationServices: ReservationService[];
}
