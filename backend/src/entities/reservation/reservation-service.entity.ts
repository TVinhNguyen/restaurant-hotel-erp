import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { PropertyService } from './property-service.entity';

@Entity({ schema: 'reservation', name: 'reservation_services' })
export class ReservationService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reservation_id', type: 'uuid' })
  reservationId: string;

  @Column({ name: 'property_service_id', type: 'uuid' })
  propertyServiceId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
  quantity: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @Column({ name: 'date_provided', type: 'date', nullable: true })
  dateProvided: Date;

  // Relations
  @ManyToOne(() => Reservation, (reservation) => reservation.reservationServices)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @ManyToOne(() => PropertyService, (propertyService) => propertyService.reservationServices)
  @JoinColumn({ name: 'property_service_id' })
  propertyService: PropertyService;
}
