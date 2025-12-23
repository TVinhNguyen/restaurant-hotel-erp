import { apiClient } from '../api-client'

export interface Restaurant {
  id: string
  propertyId?: string
  name: string
  description?: string
  cuisineType?: string
  cuisine?: string // Keep for backward compatibility
  rating?: number
  images?: string[]
  openingHours?: string
  location?: string
  address?: string // Keep for backward compatibility
  phone?: string
  email?: string
  tables?: Table[] // Tables from API response
  areas?: any[] // Restaurant areas
  property?: {
    id: string
    name: string
    address?: string
    city?: string
    country?: string
    phone?: string
    email?: string
    website?: string
    propertyType?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface Table {
  id: string
  restaurantId: string
  tableNumber: string
  capacity: number
  status: string
  location?: string
}

class RestaurantsService {
  async getRestaurants(params?: {
    page?: number
    limit?: number
    propertyId?: string
  }): Promise<{ restaurants: Restaurant[], total: number } | { data: Restaurant[] }> {
    return apiClient.get<{ restaurants: Restaurant[], total: number } | { data: Restaurant[] }>('/restaurants', params)
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    return apiClient.get<Restaurant>(`/restaurants/${id}`)
  }

  async getTables(restaurantId: string): Promise<Table[]> {
    const response = await apiClient.get<{ tables: Table[], total: number } | { data: Table[] }>('/restaurants/tables', { 
      restaurantId,
      page: 1,
      limit: 100 // Get all tables
    })
    // Handle different response formats
    if (response && 'tables' in response && Array.isArray(response.tables)) {
      return response.tables
    } else if (response && 'data' in response && Array.isArray((response as { data?: Table[] }).data)) {
      return (response as { data: Table[] }).data
    }
    return []
  }
}

export const restaurantsService = new RestaurantsService()







