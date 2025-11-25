import { apiClient } from '../api-client'

export interface Reservation {
  id: string
  propertyId?: string
  guestId?: string
  roomId?: string
  roomTypeId?: string
  checkIn: string
  checkOut: string
  numberOfGuests?: number
  numberOfRooms?: number
  adults?: number
  children?: number
  status: string
  totalAmount: number | string
  currency?: string
  confirmationCode?: string
  specialRequests?: string
  guestNotes?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  paymentStatus?: string
  createdAt?: string
  updatedAt?: string
  guest?: {
    id: string
    name: string
    email: string
    phone?: string
  }
  property?: {
    id: string
    name: string
    address?: string
    city?: string
    country?: string
    phone?: string
    email?: string
    images?: string[]
    rating?: number
  }
  roomType?: {
    id: string
    name: string
    description?: string
    basePrice?: number | string
  }
}

export interface CreateReservationRequest {
  propertyId: string
  guestId: string
  roomTypeId: string
  ratePlanId: string
  checkIn: string
  checkOut: string
  adults: number
  children?: number
  totalAmount: number
  currency: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  guestNotes?: string
  channel?: 'ota' | 'website' | 'walkin' | 'phone'
  assignedRoomId?: string
  bookerUserId?: string
  promotionId?: string
  taxAmount?: number
  discountAmount?: number
  serviceAmount?: number
  amountPaid?: number
  paymentStatus?: 'unpaid' | 'partial' | 'paid' | 'refunded'
  status?: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'
}

export interface TableBooking {
  id: string
  restaurantId: string
  tableId?: string
  guestId?: string
  bookingDate: string
  bookingTime: string
  numberOfGuests: number
  status: string
  occasion?: string
  specialRequests?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateTableBookingRequest {
  restaurantId: string
  bookingDate: string
  bookingTime: string
  numberOfGuests: number
  occasion?: string
  specialRequests?: string
  guestInfo?: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
}

class ReservationsService {
  async createReservation(
    data: CreateReservationRequest
  ): Promise<Reservation> {
    return apiClient.post<Reservation>('/reservations', data)
  }

  async getReservationById(id: string): Promise<Reservation> {
    return apiClient.get<Reservation>(`/reservations/${id}`)
  }

  async getReservations(params?: {
    page?: number
    limit?: number
    propertyId?: string
    status?: string
    guestId?: string
  }): Promise<{ data: Reservation[] }> {
    return apiClient.get<{ data: Reservation[] }>('/reservations', params)
  }

  async cancelReservation(id: string): Promise<Reservation> {
    return apiClient.put<Reservation>(`/reservations/${id}/cancel`, {})
  }

  async createTableBooking(
    data: CreateTableBookingRequest
  ): Promise<TableBooking> {
    return apiClient.post<TableBooking>('/restaurants/bookings', data)
  }

  async getTableBookingById(id: string): Promise<TableBooking> {
    return apiClient.get<TableBooking>(`/restaurants/bookings/${id}`)
  }

  async getTableBookings(params?: {
    page?: number
    limit?: number
    restaurantId?: string
    bookingDate?: string
    status?: string
  }): Promise<{ data: TableBooking[] }> {
    return apiClient.get<{ data: TableBooking[] }>('/restaurants/bookings', params)
  }
}

export const reservationsService = new ReservationsService()
