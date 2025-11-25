import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoomType } from '../inventory/room-type.entity';
import { Room } from '../inventory/room.entity';
import { RatePlan } from '../reservation/rate-plan.entity';
import { PropertyService } from '../reservation/property-service.entity';
import { Promotion } from '../reservation/promotion.entity';
import { TaxRule } from '../reservation/tax-rule.entity';
import { Reservation } from '../reservation/reservation.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { WorkingShift } from '../hr/working-shift.entity';

@Entity({ schema: 'core', name: 'properties' })
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 100, nullable: true })
  website: string;

  @Column({ name: 'property_type', length: 50, nullable: true })
  propertyType: 'Hotel' | 'Resort' | 'Restaurant Chain';

  // Relations
  @OneToMany(() => RoomType, (roomType) => roomType.property)
  roomTypes: RoomType[];

  @OneToMany(() => Room, (room) => room.property)
  rooms: Room[];

  @OneToMany(() => RatePlan, (ratePlan) => ratePlan.property)
  ratePlans: RatePlan[];

  @OneToMany(
    () => PropertyService,
    (propertyService) => propertyService.property,
  )
  propertyServices: PropertyService[];

  @OneToMany(() => Promotion, (promotion) => promotion.property)
  promotions: Promotion[];

  @OneToMany(() => TaxRule, (taxRule) => taxRule.property)
  taxRules: TaxRule[];

  @OneToMany(() => Reservation, (reservation) => reservation.property)
  reservations: Reservation[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.property)
  restaurants: Restaurant[];

  @OneToMany(() => WorkingShift, (workingShift) => workingShift.property)
  workingShifts: WorkingShift[];
}
