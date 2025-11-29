"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Star, MapPin, Mail, Phone, Loader2, Calendar, Users, Bed, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { colors, shadows, borderRadius } from "@/lib/designTokens"
import { reservationsService, type Reservation } from "@/lib/services/reservations"
import { propertiesService } from "@/lib/services/properties"
import { paymentService } from "@/lib/services/payments"
import { showToast } from "@/lib/toast"

export default function BookingConfirmationPage() {
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [property, setProperty] = useState<{ id: string; name: string; images?: string[]; address?: string; city?: string; country?: string; phone?: string; email?: string; rating?: number } | null>(null)
  const [roomType, setRoomType] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const reservationId = localStorage.getItem("reservation_id")
        if (!reservationId) {
          router.push("/properties")
          return
        }

        const res = await reservationsService.getReservationById(reservationId)
        setReservation(res)

        // Fetch property
        if (res.propertyId) {
          const prop = await propertiesService.getPropertyById(res.propertyId)
          setProperty(prop)
        }

        // Fetch room type
        if (res.roomTypeId && res.propertyId) {
          const roomTypes = await propertiesService.getRoomTypes(res.propertyId)
          const rt = roomTypes.find((r) => r.id === res.roomTypeId)
          if (rt) {
            setRoomType(rt)
          }
        }
      } catch (err) {
        console.error("Failed to load reservation:", err)
        setError(err instanceof Error ? err.message : "Không thể tải thông tin đặt phòng")
      } finally {
        setLoading(false)
      }
    }

    loadReservation()
  }, [router])

  const getImageUrl = (images?: string[]) => {
    if (images && images.length > 0) {
      return images[0]
    }
    return "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg"
  }

  const getLocationText = () => {
    if (!property) return ""
    if (property.city && property.country) {
      return `${property.city}, ${property.country}`
    }
    if (property.address) {
      return property.address
    }
    return "Chưa có địa chỉ"
  }

  const handlePayment = async () => {
    if (!reservation) return

    try {
      setIsProcessingPayment(true)
      const amount = typeof reservation.totalAmount === 'number' 
        ? reservation.totalAmount 
        : typeof reservation.totalAmount === 'string' 
          ? parseFloat(reservation.totalAmount) 
          : 0

      const amountInVND = reservation.currency === 'USD' ? Math.round(amount * 25000) : Math.round(amount)
      
      const description = `Thanh toán #${reservation.confirmationCode || reservation.id}`.slice(0, 25)
      const orderId = Date.now()

      const response = await paymentService.createPayment(amountInVND, description, orderId)
      
      console.log('Payment response:', response)
      
      // Lưu orderId và reservationId để check sau (luôn lưu dạng string trong localStorage)
      const finalOrderId = response.orderId ?? orderId
      if (typeof window !== 'undefined') {
        localStorage.setItem('payment_orderId', String(finalOrderId))
        localStorage.setItem('payment_reservationId', reservation.id)
      }

      const checkoutUrl = response.data?.checkoutUrl
      
      if (!checkoutUrl) {
        console.error('Response structure:', JSON.stringify(response, null, 2))
        console.error('Available keys:', Object.keys(response))
        if (response.data) {
          console.error('Data keys:', Object.keys(response.data))
        }
        throw new Error(`Không nhận được checkout URL từ PayOS. Kiểm tra console để xem chi tiết.`)
      }
      
      console.log('Redirecting to PayOS:', checkoutUrl)
      paymentService.redirectToPayOS(checkoutUrl)
    } catch (err) {
      console.error('Payment error:', err)
      showToast.error(
        err instanceof Error ? err.message : 'Lỗi tạo thanh toán. Vui lòng thử lại.'
      )
      setIsProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }} className="mb-4">
            {error || "Không tìm thấy thông tin đặt phòng"}
          </p>
          <Link href="/properties">
            <Button style={{ backgroundColor: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Quay lại danh sách
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const checkInDate = new Date(reservation.checkIn)
  const checkOutDate = new Date(reservation.checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

  const totalAmount = typeof reservation.totalAmount === 'number' 
    ? reservation.totalAmount 
    : typeof reservation.totalAmount === 'string' 
      ? parseFloat(reservation.totalAmount) 
      : 0

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Icon and Message */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{ backgroundColor: colors.lightBlue }}
          >
            <CheckCircle className="w-16 h-16" style={{ color: colors.success }} />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Đặt phòng thành công!
          </h1>
          {reservation.confirmationCode && (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
              <span style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Mã xác nhận:
              </span>
              <span className="font-bold text-lg" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {reservation.confirmationCode}
              </span>
            </div>
          )}
        </div>

        {/* Booking Details Card */}
        <div
          className="bg-white p-8 mb-8"
          style={{
            borderRadius: borderRadius.card,
            boxShadow: shadows.card,
          }}
        >
          <div className="space-y-8">
            {/* Property Image */}
            {property && (
              <div className="relative">
                <img
                  src={getImageUrl(property.images)}
                  alt={property.name}
                  className="w-full h-64 object-cover"
                  style={{ borderRadius: borderRadius.image }}
                />
              </div>
            )}

            {/* Property Info */}
            {property && (
              <div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {property.name}
                </h2>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {getLocationText()}
                </p>
                <div className="flex items-center gap-4">
                  {property.rating && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-lg" style={{ backgroundColor: colors.lightBlue }}>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                        {property.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {roomType && (
                    <div className="px-3 py-1 rounded-lg" style={{ backgroundColor: colors.lightBlue }}>
                      <span className="text-sm font-medium" style={{ color: colors.primary }}>
                        {roomType.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trip Details */}
            <div 
              className="p-6 rounded-xl"
              style={{ backgroundColor: colors.lightBlue }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Chi tiết chuyến đi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary }}>
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Nhận phòng
                    </p>
                    <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {checkInDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm mt-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Từ 15:00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary }}>
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Trả phòng
                    </p>
                    <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {checkOutDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm mt-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Trước 11:00
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: colors.primary }} />
                  <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {reservation.adults} {reservation.adults === 1 ? 'khách' : 'khách'}
                    {reservation.children ? `, ${reservation.children} ${reservation.children === 1 ? 'trẻ em' : 'trẻ em'}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4" style={{ color: colors.primary }} />
                  <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {nights} {nights === 1 ? 'đêm' : 'đêm'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Thời gian: {nights} {nights === 1 ? 'đêm' : 'đêm'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {property && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Thông tin liên hệ
                </h3>
                {property.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1" style={{ color: colors.primary }} />
                    <div>
                      <p className="font-medium mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Địa chỉ
                      </p>
                      <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {property.address}
                      </p>
                      {property.city && property.country && (
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {property.city}, {property.country}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {property.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1" style={{ color: colors.primary }} />
                    <div>
                      <p className="font-medium mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Email
                      </p>
                      <p className="text-sm" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {property.email}
                      </p>
                    </div>
                  </div>
                )}
                {property.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-1" style={{ color: colors.primary }} />
                    <div>
                      <p className="font-medium mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Điện thoại
                      </p>
                      <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {property.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price Summary */}
            <div className="border-t pt-6" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Tổng tiền
                  </p>
                  {reservation.currency && (
                    <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {reservation.currency}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold mb-2" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {reservation.currency || '$'}{totalAmount.toFixed(2)}
                  </p>
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: reservation.paymentStatus === 'paid' 
                        ? colors.success 
                        : reservation.paymentStatus === 'unpaid'
                        ? '#FCD34D'
                        : colors.textSecondary,
                      color: '#FFFFFF',
                    }}
                  >
                    {reservation.paymentStatus === 'paid' 
                      ? 'Đã thanh toán' 
                      : reservation.paymentStatus === 'unpaid'
                      ? 'Chưa thanh toán'
                      : 'Đang xử lý'}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button - Show if unpaid */}
            {reservation.paymentStatus === 'unpaid' && (
              <div className="pt-6 border-t" style={{ borderColor: colors.border }}>
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colors.success,
                    borderRadius: borderRadius.button,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Thanh toán ngay
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t" style={{ borderColor: colors.border }}>
              {property && (
                <Link href={`/property/${property.id}`} className="flex-1">
                  <Button 
                    className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: borderRadius.button,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Xem khách sạn
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
          </div>
        </div>

        {/* Additional Information */}
        <div className="text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            Email xác nhận đã được gửi đến <span className="font-semibold" style={{ color: colors.textPrimary }}>{reservation.contactEmail || 'địa chỉ email của bạn'}</span>.
          </p>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Cần hỗ trợ? Liên hệ{" "}
            <a href="/contact" className="font-semibold hover:underline" style={{ color: colors.primary }}>
              bộ phận chăm sóc khách hàng
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
