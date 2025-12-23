import { apiClient } from '../api-client'

export interface Guest {
  id: string
  name: string
  email?: string
  phone?: string
  loyaltyTier?: string
  passportId?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateGuestRequest {
  name: string
  email?: string
  phone?: string
  loyaltyTier?: string
  passportId?: string
  consentMarketing?: boolean
  privacyVersion?: string
}

class GuestsService {
  async createGuest(data: CreateGuestRequest): Promise<Guest> {
    return apiClient.post<Guest>('/guests', data)
  }

  async getGuestById(id: string): Promise<Guest> {
    return apiClient.get<Guest>(`/guests/${id}`)
  }

  async findGuestByEmail(email: string): Promise<Guest | null> {
    try {
      const response = await apiClient.get<{ data: Guest[] }>('/guests', { search: email })
      
      // Check if response is array directly or nested in data
      let guests: Guest[] = []
      if (Array.isArray(response)) {
        guests = response
      } else if (response.data && Array.isArray(response.data)) {
        guests = response.data
      } else if (typeof response === 'object' && response !== null) {
        // Handle object with numeric keys (convert to array)
        const values: unknown[] = Object.values(response)
        // Filter out non-Guest objects
        guests = values.filter((item): item is Guest => {
          if (typeof item !== 'object' || item === null) return false
          const obj = item as Record<string, unknown>
          return 'id' in obj && 'name' in obj
        })
      }
      
      const guest = guests.find(g => g.email?.toLowerCase() === email.toLowerCase())
      return guest || null
    } catch (error) {
      console.error("Error finding guest by email:", error)
      return null
    }
  }
}

export const guestsService = new GuestsService()

