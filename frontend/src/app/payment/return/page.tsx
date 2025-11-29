"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { colors, shadows, borderRadius } from "@/lib/designTokens"
import { paymentService } from "@/lib/services/payments"
import { reservationsService, type CreateReservationRequest } from "@/lib/services/reservations"
import { showToast } from "@/lib/toast"

export default function PaymentReturnPage() {
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'cancelled'>('checking')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isCreatingReservation, setIsCreatingReservation] = useState(false)
  const [hasCreatedReservation, setHasCreatedReservation] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlOrderId = searchParams.get('orderId') || searchParams.get('orderCode')
      const storedOrderId = typeof window !== 'undefined' 
        ? localStorage.getItem('payment_orderId') 
        : null
      
      const finalOrderId = urlOrderId || storedOrderId

      if (!finalOrderId) {
        console.error('Không tìm thấy orderId')
        setStatus('failed')
        return
      }

      const orderIdStr = String(finalOrderId)
      setOrderId(orderIdStr)
      console.log('Checking payment for orderId:', orderIdStr)

      const poll = setInterval(async () => {
        try {
          const data = await paymentService.getPaymentStatus(orderIdStr)
          console.log('Payment status:', data)

          if (data.found && data.status === 'success') {
            clearInterval(poll)

            if (!hasCreatedReservation) {
              setIsCreatingReservation(true)
              try {
                if (typeof window !== 'undefined') {
                  const payloadStr = localStorage.getItem('pending_reservation_payload')
                  if (!payloadStr) {
                    console.error('Missing pending_reservation_payload')
                    throw new Error('Không tìm thấy dữ liệu đặt phòng để tạo reservation.')
                  }

                  const payload: CreateReservationRequest = JSON.parse(payloadStr)

                  const reservation = await reservationsService.createReservation({
                    ...payload,
                    paymentStatus: 'paid',
                    status: 'confirmed',
                  })

                  localStorage.setItem('reservation_id', reservation.id)

                  localStorage.removeItem('pending_reservation_payload')
                  localStorage.removeItem('booking_context')
                  localStorage.removeItem('booking_dates')
                  localStorage.removeItem('payment_orderId')
                }

                setHasCreatedReservation(true)
                setStatus('success')
                showToast.success('Thanh toán và đặt phòng thành công!')

                // Redirect sang trang xác nhận đặt phòng
                router.push('/booking/confirmation')
              } catch (err) {
                console.error('Error creating reservation after payment:', err)
                setStatus('failed')
                showToast.error(
                  err instanceof Error
                    ? err.message
                    : 'Thanh toán thành công nhưng không thể tạo reservation. Vui lòng liên hệ hỗ trợ.'
                )
              } finally {
                setIsCreatingReservation(false)
              }
            }
          } else if (data.found && (data.status === 'failed' || data.status === 'cancelled')) {
            clearInterval(poll)
            setStatus(data.status === 'cancelled' ? 'cancelled' : 'failed')
            
            if (typeof window !== 'undefined') {
              localStorage.removeItem('payment_orderId')
            }

            showToast.error(
              data.status === 'cancelled' 
                ? 'Thanh toán đã bị hủy' 
                : 'Thanh toán thất bại'
            )
          }
          // Nếu status = 'pending' → tiếp tục polling
        } catch (error) {
          console.error('Error checking status:', error)
        }
      }, 2000)

      // Timeout sau 1 phút
      setTimeout(() => {
        clearInterval(poll)
        if (status === 'checking') {
          setStatus('failed')
          showToast.error('Không thể xác nhận thanh toán. Vui lòng liên hệ support.')
        }
      }, 60000)

      // Cleanup
      return () => {
        clearInterval(poll)
      }
    }

    checkPaymentStatus()
  }, [searchParams, status])

  const getReservationId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('payment_reservationId')
    }
    return null
  }

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div
          className="bg-white p-8 text-center"
          style={{
            borderRadius: borderRadius.card,
            boxShadow: shadows.card,
          }}
        >
          {status === 'checking' && (
            <>
              <div className="mb-6">
                <Loader2 className="w-16 h-16 mx-auto animate-spin" style={{ color: colors.primary }} />
              </div>
              <h1 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Đang xác nhận thanh toán...
              </h1>
              <p className="text-sm mb-2" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Vui lòng đợi trong giây lát
              </p>
              {orderId && (
                <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Mã đơn hàng: {orderId}
                </p>
              )}
            </>
          )}

          {status === 'success' && (
            <>
              <div 
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <CheckCircle className="w-16 h-16" style={{ color: colors.success }} />
              </div>
              <h1 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Thanh toán thành công!
              </h1>
              <p className="text-sm mb-6" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Đơn đặt phòng của bạn đã được thanh toán thành công.
              </p>
              {orderId && (
                <p className="text-xs mb-6" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Mã đơn hàng: {orderId}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                {getReservationId() && (
                  <Link href={`/booking/confirmation`} className="flex-1">
                    <Button 
                      className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: colors.primary,
                        borderRadius: borderRadius.button,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      Xem đặt phòng
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <Link href="/profile" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full py-4 font-semibold rounded-xl transition-all"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      borderRadius: borderRadius.button,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Xem trong hồ sơ
                  </Button>
                </Link>
              </div>
            </>
          )}

          {(status === 'failed' || status === 'cancelled') && (
            <>
              <div 
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                style={{ backgroundColor: '#FEE2E2' }}
              >
                <XCircle className="w-16 h-16" style={{ color: '#DC2626' }} />
              </div>
              <h1 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {status === 'cancelled' ? 'Thanh toán đã bị hủy' : 'Thanh toán thất bại'}
              </h1>
              <p className="text-sm mb-6" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {status === 'cancelled' 
                  ? 'Bạn đã hủy thanh toán. Đơn đặt phòng vẫn được giữ.'
                  : 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}
              </p>
              {orderId && (
                <p className="text-xs mb-6" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Mã đơn hàng: {orderId}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                {getReservationId() && (
                  <Link href={`/booking/confirmation`} className="flex-1">
                    <Button 
                      className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: colors.primary,
                        borderRadius: borderRadius.button,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      Thử lại thanh toán
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <Link href="/properties" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full py-4 font-semibold rounded-xl transition-all"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      borderRadius: borderRadius.button,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Về trang chủ
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

