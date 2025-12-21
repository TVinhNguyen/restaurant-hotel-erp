import { apiClient } from '../api-client'

export interface CreatePaymentRequest {
  orderId: number
  amount: number
  description: string
}

export interface CreatePaymentResponse {
  code: number
  desc: string
  data: {
    bin: string
    accountNumber: string
    accountName: string
    amount: number
    description: string
    orderCode: number
    currency: string
    paymentLinkId: string
    status: string
    checkoutUrl: string
    qrCode: string
  }
  signature: string
  orderId?: number
}

export interface PaymentStatusResponse {
  found: boolean
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  orderId?: string
  amount?: number
  description?: string
  createdAt?: string
}

class PaymentService {
  async createPayment(
    amount: number,
    description: string,
    orderId?: number
  ): Promise<CreatePaymentResponse> {
    const finalOrderId = orderId ?? Date.now()
    
    try {
      const response = await apiClient.post<CreatePaymentResponse>(
        '/payments-pos',
        {
          orderId: finalOrderId, // number
          amount,
          description,
        } as CreatePaymentRequest,
      )
      
      if (!response) {
        throw new Error('Không nhận được response từ server')
      }
      
      // Handle different response formats from PayOS API
      const checkoutUrl = response.data?.checkoutUrl || 
        (response as CreatePaymentResponse & { data?: { data?: { checkoutUrl?: string } } }).data?.data?.checkoutUrl ||
        (response as CreatePaymentResponse & { checkoutUrl?: string }).checkoutUrl
      
      if (!checkoutUrl) {
        throw new Error('Response không có checkoutUrl từ PayOS')
      }
      
      // Ensure response has the correct structure
      if (!response.data) {
        response.data = {
          bin: '',
          accountNumber: '',
          accountName: '',
          amount: amount,
          description: description,
          orderCode: finalOrderId,
          currency: 'VND',
          paymentLinkId: '',
          status: 'pending',
          checkoutUrl: checkoutUrl,
          qrCode: '',
        }
      } else if (!response.data.checkoutUrl) {
        response.data.checkoutUrl = checkoutUrl
      }
      
      return response
    } catch (error) {
      throw error
    }
  }

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    return apiClient.get<PaymentStatusResponse>(`/payments-pos/status/${orderId}`)
  }

  redirectToPayOS(checkoutUrl: string): void {
    if (typeof window !== 'undefined') {
      window.location.href = checkoutUrl
    }
  }
}

export const paymentService = new PaymentService()

