import { apiClient } from '../api-client'

export interface Promotion {
  id: string
  propertyId: string | null
  code: string
  discountPercent: number
  validFrom: string | null
  validTo: string | null
  description: string | null
  notes: string | null
  active: boolean
  property?: {
    id: string
    name: string
  }
}

export interface PromotionValidationResult {
  valid: boolean
  promotion?: Promotion
  error?: string
}

export interface PromotionApplyResult {
  promotionId: string
  code: string
  discountPercent: number
  discountAmount: number
  finalAmount: number
  valid: boolean
  message: string
}

class PromotionsService {
  async getPromotions(params?: {
    page?: number
    limit?: number
    propertyId?: string
    active?: boolean
  }): Promise<{ data: Promotion[]; total: number; page: number; limit: number; totalPages: number }> {
    return apiClient.get('/promotions', params)
  }

  async getPromotionById(id: string): Promise<Promotion> {
    return apiClient.get<Promotion>(`/promotions/${id}`)
  }

  async getPromotionByCode(code: string): Promise<Promotion> {
    return apiClient.get<Promotion>(`/promotions/code/${code}`)
  }

  async validatePromotion(
    code: string,
    propertyId: string
  ): Promise<PromotionValidationResult> {
    return apiClient.post<PromotionValidationResult>('/promotions/validate', {
      code,
      propertyId,
    })
  }

  async applyPromotion(
    code: string,
    propertyId: string,
    baseAmount: number
  ): Promise<PromotionApplyResult> {
    return apiClient.post<PromotionApplyResult>('/promotions/apply', {
      code,
      propertyId,
      baseAmount,
    })
  }
}

export const promotionsService = new PromotionsService()

