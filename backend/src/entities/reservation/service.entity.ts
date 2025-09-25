import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PropertyService } from './property-service.entity';

@Entity({ schema: 'reservation', name: 'services' })
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, nullable: true })
  unit: string;

  // Relations
  @OneToMany(
    () => PropertyService,
    (propertyService) => propertyService.service,
  )
  propertyServices: PropertyService[];
}
