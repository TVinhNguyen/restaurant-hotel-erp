import { apiClient } from '../api-client'

export interface Property {
  id: string
  name: string
  type?: string
  propertyType?: string
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  description?: string
  rating?: number
  images?: string[]
  amenities?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface PropertyListResponse {
  data: Property[]
  total?: number
  page?: number
  limit?: number
}

export interface RoomType {
  id: string
  propertyId: string
  name: string
  description?: string
  maxOccupancy?: number
  maxAdults?: number
  maxChildren?: number
  basePrice: number | string
  bedType?: string
  images?: string[]
  amenities?: string[]
}

export interface Room {
  id: string
  propertyId: string
  roomTypeId: string
  number?: string
  roomNumber?: string
  floor?: number | string
  viewType?: string
  operationalStatus?: string
  housekeepingStatus?: string
  housekeeperNotes?: string | null
  status?: string
  roomType?: RoomType
}

class PropertiesService {
  async getProperties(params?: {
    page?: number
    limit?: number
    type?: string
    search?: string
  }): Promise<PropertyListResponse> {
    return apiClient.get<PropertyListResponse>('/properties', params)
  }

  async getPropertyById(id: string): Promise<Property> {
    return apiClient.get<Property>(`/properties/${id}`)
  }

  async getRoomTypes(propertyId: string): Promise<RoomType[]> {
    const response = await apiClient.get<{ data: RoomType[] } | RoomType[]>('/room-types', { propertyId })
    // Backend returns { data: RoomType[] } format
    if (Array.isArray(response)) {
      return response
    }
    return response.data || []
  }

  async getRooms(propertyId: string, params?: {
    status?: string
    floor?: number
    page?: number
    limit?: number
  }): Promise<{ data: Room[], total?: number, page?: number, limit?: number }> {
    return apiClient.get<{ data: Room[], total?: number, page?: number, limit?: number }>('/rooms', {
      propertyId: propertyId,
      ...params,
    })
  }

  async getPropertyRooms(propertyId: string): Promise<{ rooms?: Room[], roomTypes?: RoomType[] }> {
    return apiClient.get<{ rooms?: Room[], roomTypes?: RoomType[] }>(`/properties/${propertyId}/rooms`)
  }

  async getPropertyRestaurants(propertyId: string): Promise<Property & { restaurants?: any[] }> {
    return apiClient.get<Property & { restaurants?: any[] }>(`/properties/${propertyId}/restaurants`)
  }

  async getAvailableRooms(
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): Promise<Room[]> {
    return apiClient.get<Room[]>('/rooms/available', {
      propertyId: propertyId,
      checkIn: checkIn,
      checkOut: checkOut,
    })
  }
}

export const propertiesService = new PropertiesService()



