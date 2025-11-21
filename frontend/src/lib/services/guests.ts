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
      const guest = response.data?.find(g => g.email?.toLowerCase() === email.toLowerCase())
      return guest || null
    } catch {
      return null
    }
  }
}

export const guestsService = new GuestsService()

