// Type definitions for Reservation entities aligned with backend schema

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  loyaltyTier?: string;
  passportId?: string;
  consentMarketing?: boolean;
  privacyVersion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  propertyType?: 'Hotel' | 'Resort' | 'Restaurant Chain';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface RoomType {
  id: string;
  propertyId: string;
  name: string;
  description?: string;
  maxAdults?: number;
  maxChildren?: number;
  basePrice?: number;
  bedType?: string;
  property?: Property;
}

export interface Room {
  id: string;
  propertyId: string;
  roomTypeId: string;
  number: string;
  floor?: string;
  viewType?: string;
  operationalStatus?: 'available' | 'out_of_service';
  housekeepingStatus?: 'clean' | 'dirty' | 'inspected';
  housekeeperNotes?: string;
  property?: Property;
  roomType?: RoomType;
}

export interface RatePlan {
  id: string;
  propertyId: string;
  roomTypeId: string;
  name: string;
  cancellationPolicy?: string;
  currency: string;
  minStay?: number;
  maxStay?: number;
  isRefundable?: boolean;
  property?: Property;
  roomType?: RoomType;
}

export interface Promotion {
  id: string;
  code: string;
  discountPercent: number;
  validFrom?: string;
  validTo?: string;
  propertyId?: string;
  property?: Property;
}

export type ReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 
  | 'unpaid'
  | 'partial'
  | 'paid'
  | 'refunded';

export type BookingChannel = 
  | 'ota'
  | 'website'
  | 'walkin'
  | 'phone';

export interface Reservation {
  id: string;
  propertyId: string;
  guestId: string;
  bookerUserId?: string;
  channel?: BookingChannel;
  externalRef?: string;
  promotionId?: string;
  checkIn: string; // Date string YYYY-MM-DD
  checkOut: string; // Date string YYYY-MM-DD
  status: ReservationStatus;
  roomTypeId: string;
  ratePlanId: string;
  assignedRoomId?: string;
  adults: number;
  children?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  guestNotes?: string;
  confirmationCode?: string;
  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  serviceAmount?: number;
  amountPaid?: number;
  currency: string;
  paymentStatus?: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
  
  // Relations
  property?: Property;
  guest?: Guest;
  roomType?: RoomType;
  ratePlan?: RatePlan;
  assignedRoom?: Room;
  promotion?: Promotion;
}

export interface CreateReservationDto {
  propertyId: string;
  guestId: string;
  roomTypeId: string;
  ratePlanId: string;
  bookerUserId?: string;
  assignedRoomId?: string;
  channel?: BookingChannel;
  externalRef?: string;
  promotionId?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  guestNotes?: string;
  confirmationCode?: string;
  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  serviceAmount?: number;
  amountPaid?: number;
  currency: string;
  paymentStatus?: PaymentStatus;
  status?: ReservationStatus;
}

export interface UpdateReservationDto {
  propertyId?: string;
  guestId?: string;
  roomTypeId?: string;
  ratePlanId?: string;
  bookerUserId?: string;
  assignedRoomId?: string;
  channel?: BookingChannel;
  externalRef?: string;
  promotionId?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  guestNotes?: string;
  confirmationCode?: string;
  totalAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  serviceAmount?: number;
  amountPaid?: number;
  currency?: string;
  paymentStatus?: PaymentStatus;
  status?: ReservationStatus;
}

export interface CreateGuestDto {
  name: string;
  email?: string;
  phone?: string;
  passportId?: string;
  consentMarketing?: boolean;
  loyaltyTier?: string;
  privacyVersion?: string;
}

export interface UpdateGuestDto {
  name?: string;
  email?: string;
  phone?: string;
  passportId?: string;
  consentMarketing?: boolean;
  loyaltyTier?: string;
  privacyVersion?: string;
}

// Table Bookings Types
export type TableBookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'seated'
  | 'completed'
  | 'no_show'
  | 'cancelled';

export interface Restaurant {
  id: string;
  propertyId: string;
  name: string;
  description?: string;
  location?: string;
  openingHours?: string;
  cuisineType?: string;
  property?: Property;
}

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  areaId?: string;
  tableNumber: string;
  capacity: number;
  status?: 'available' | 'occupied' | 'reserved';
  restaurant?: Restaurant;
}

export interface TableBooking {
  id: string;
  restaurantId: string;
  guestId?: string;
  reservationId?: string;
  bookingDate: string; // Date string YYYY-MM-DD
  bookingTime: string; // Time string HH:mm:ss
  pax: number;
  status: TableBookingStatus;
  assignedTableId?: string;
  specialRequests?: string;
  durationMinutes?: number;
  createdAt?: string;
  
  // Relations
  restaurant?: Restaurant;
  guest?: Guest;
  reservation?: Reservation;
  assignedTable?: RestaurantTable;
}

export interface CreateTableBookingDto {
  restaurantId: string;
  guestId?: string;
  reservationId?: string;
  bookingDate: string;
  bookingTime: string;
  pax: number;
  status?: TableBookingStatus;
  assignedTableId?: string;
  specialRequests?: string;
  durationMinutes?: number;
}

export interface UpdateTableBookingDto {
  restaurantId?: string;
  guestId?: string;
  reservationId?: string;
  bookingDate?: string;
  bookingTime?: string;
  pax?: number;
  status?: TableBookingStatus;
  assignedTableId?: string;
  specialRequests?: string;
  durationMinutes?: number;
}
