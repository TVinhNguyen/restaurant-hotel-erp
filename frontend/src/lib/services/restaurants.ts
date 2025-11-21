import { apiClient } from '../api-client'

export interface Restaurant {
  id: string
  propertyId?: string
  name: string
  description?: string
  cuisine?: string
  rating?: number
  images?: string[]
  openingHours?: string
  address?: string
  phone?: string
  email?: string
  createdAt?: string
  updatedAt?: string
}

export interface MenuCategory {
  id: string
  restaurantId: string
  name: string
  description?: string
  displayOrder?: number
  items?: MenuItem[]
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description?: string
  price: number
  image?: string
  isAvailable?: boolean
  displayOrder?: number
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
  }): Promise<{ data: Restaurant[] }> {
    return apiClient.get<{ data: Restaurant[] }>('/restaurants', params)
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    return apiClient.get<Restaurant>(`/restaurants/${id}`)
  }

  async getMenu(restaurantId: string): Promise<{
    categories: MenuCategory[]
    items: MenuItem[]
  }> {
    return apiClient.get<{
      categories: MenuCategory[]
      items: MenuItem[]
    }>(`/restaurants/${restaurantId}/menu`)
  }

  async getTables(restaurantId: string): Promise<Table[]> {
    return apiClient.get<Table[]>(`/restaurants/${restaurantId}/tables`)
  }
}

export const restaurantsService = new RestaurantsService()







