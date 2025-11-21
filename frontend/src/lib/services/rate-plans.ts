import { apiClient } from '../api-client'

export interface RatePlan {
  id: string
  propertyId: string
  roomTypeId: string
  name: string
  cancellationPolicy?: string
  currency: string
  minStay?: number
  maxStay?: number
  isRefundable: boolean
}

export interface RatePlanListResponse {
  data: RatePlan[]
  total?: number
  page?: number
  limit?: number
}

class RatePlansService {
  async getRatePlans(params?: {
    page?: number
    limit?: number
    propertyId?: string
    roomTypeId?: string
  }): Promise<RatePlanListResponse> {
    return apiClient.get<RatePlanListResponse>('/rate-plans', params)
  }

  async getRatePlanById(id: string): Promise<RatePlan> {
    return apiClient.get<RatePlan>(`/rate-plans/${id}`)
  }
}

export const ratePlansService = new RatePlansService()

