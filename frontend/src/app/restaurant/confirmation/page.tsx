"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Clock, Users, Calendar, Utensils, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { restaurantsService, type Restaurant } from "@/lib/services/restaurants"
import { reservationsService } from "@/lib/services/reservations"
import { guestsService } from "@/lib/services/guests"
import { authService } from "@/lib/auth"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

interface BookingData {
  date: string
  time: string
  guests: number
  tableId: string
  tableNumber?: string
  tableCapacity?: number
  restaurantId: string
  restaurantName: string
}

export default function RestaurantConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get('id')
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // ✅ Prevent duplicate API calls in React Strict Mode (development)
  const hasCreatedBooking = useRef(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Get booking data from localStorage
        const storedBooking = localStorage.getItem("restaurant_booking")
        if (!storedBooking) {
          setError("Không tìm thấy thông tin đặt bàn")
          setIsLoading(false)
          return
        }

        const booking: BookingData = JSON.parse(storedBooking)
        setBookingData(booking)

        // Fetch restaurant details
        if (restaurantId || booking.restaurantId) {
          const restaurantData = await restaurantsService.getRestaurantById(
            restaurantId || booking.restaurantId
          )
          setRestaurant(restaurantData)

          // Create the actual booking via API (only once, prevent duplicate in React Strict Mode)
          if (!hasCreatedBooking.current) {
            hasCreatedBooking.current = true
            
            try {
              // ✅ Get current user and find/create guest
              let guestId: string | undefined
              
              if (authService.isAuthenticated()) {
                try {
                  const user = await authService.getCurrentUser()
                  
                  // Find existing guest by email
                  const existingGuest = await guestsService.findGuestByEmail(user.email)
                  
                  if (existingGuest) {
                    guestId = existingGuest.id
                  } else {
                    // Create new guest from user info
                    const newGuest = await guestsService.createGuest({
                      name: user.name || user.email.split('@')[0],
                      email: user.email,
                      phone: user.phone,
                    })
                    guestId = newGuest.id
                  }
                } catch (userError) {
                  console.error("Failed to get/create guest:", userError)
                  // Continue without guestId if user is not logged in
                }
              }

              const bookingPayload = {
                restaurantId: booking.restaurantId,
                bookingDate: booking.date,
                bookingTime: booking.time,
                pax: booking.guests,
                assignedTableId: booking.tableId,
                guestId, // ✅ Add guestId to payload
              }
              
              const createdBooking = await reservationsService.createTableBooking(bookingPayload)
              setBookingId(createdBooking.id)

              // ✅ Clear localStorage after successful booking
              localStorage.removeItem("restaurant_booking")
              localStorage.removeItem("restaurant_booking_form")
            } catch (apiError: any) {
              console.error("Failed to create booking:", apiError)
              console.error("Error details:", {
                message: apiError?.message,
                stack: apiError?.stack,
                response: apiError?.response,
              })
              // Reset flag on error so user can retry
              hasCreatedBooking.current = false
              
              // Show error to user
              setError("Không thể tạo đặt bàn. Vui lòng thử lại hoặc liên hệ hỗ trợ.")
            }
          }
        }
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Không thể tải thông tin đặt bàn")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [restaurantId])

  const getImageUrl = (images?: string[]) => {
    if (images && images.length > 0) {
      return images[0]
    }
    return "/modern-hotel-room-with-city-view-london.jpg"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <Header />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !bookingData || !restaurant) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg mb-4" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {error || "Không tìm thấy thông tin đặt bàn"}
            </p>
            <Link href="/restaurants">
              <Button style={{ backgroundColor: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Xem danh sách nhà hàng
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <CheckCircle className="w-12 h-12" style={{ color: colors.primary }} />
            </div>
            <h2 
              className="text-3xl font-bold mb-2" 
              style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Đặt bàn thành công!
            </h2>
            <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Bàn của bạn đã được đặt tại {restaurant.name}
            </p>
            {bookingId && (
              <p className="mt-2 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Mã đặt bàn: <span className="font-mono font-semibold" style={{ color: colors.primary }}>{bookingId}</span>
              </p>
            )}
          </div>

          {/* Main Card */}
          <Card 
            className="mb-8 bg-white" 
            style={{ 
              borderRadius: borderRadius.card, 
              boxShadow: shadows.card,
              border: `1px solid ${colors.border}` 
            }}
          >
            <CardContent className="p-8 bg-white">
              <div className="space-y-6">
                {/* Restaurant Image */}
                <div className="relative">
                  <img
                    src={getImageUrl(restaurant.images)}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                    style={{ borderRadius: borderRadius.image }}
                  />
                </div>

                {/* Restaurant Info */}
                <div>
                  <h3 
                    className="text-2xl font-bold mb-2" 
                    style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {restaurant.name}
                  </h3>
                  {restaurant.rating && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex" style={{ color: '#FFD700' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <Badge style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}>
                        {restaurant.rating.toFixed(1)}
                      </Badge>
                      {restaurant.description && (
                        <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {restaurant.description}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Reservation Details */}
                <div 
                  className="rounded-lg p-6"
                  style={{ backgroundColor: colors.lightBlue }}
                >
                  <h4 
                    className="font-semibold mb-4" 
                    style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Thông tin đặt bàn
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        <Calendar className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Ngày
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {formatDate(bookingData.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        <Clock className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Giờ
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {bookingData.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        <Users className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Số khách
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {bookingData.guests} người
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        <Utensils className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Bàn
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Bàn {bookingData.tableNumber || '#' + bookingData.tableId?.slice(-4)}
                          {bookingData.tableCapacity && ` (${bookingData.tableCapacity} chỗ)`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div>
                    <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Địa chỉ nhà hàng
                    </p>
                    <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {restaurant.location || 'Đang cập nhật'}
                    </p>
                  </div>
                </div>

                {/* Important Reminders */}
                <div 
                  className="rounded-lg p-4"
                  style={{ backgroundColor: `${colors.primary}10` }}
                >
                  <h4 
                    className="font-medium mb-2" 
                    style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Lưu ý quan trọng
                  </h4>
                  <ul className="text-sm space-y-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <li>• Vui lòng đến đúng giờ để tránh mất chỗ</li>
                    {restaurant.openingHours && (
                      <li>• Giờ mở cửa: {restaurant.openingHours}</li>
                    )}
                    <li>• Có thể hủy miễn phí trước 2 giờ</li>
                    <li>• Nhà hàng có thể đáp ứng các yêu cầu ăn uống đặc biệt</li>
                    {bookingId && <li>• Mã đặt bàn: {bookingId}</li>}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href={`/restaurant/${restaurant.id}`} className="flex-1">
                    <Button 
                      className="w-full" 
                      size="lg"
                      style={{ 
                        backgroundColor: colors.primary,
                        borderRadius: borderRadius.button,
                        fontFamily: 'system-ui, -apple-system, sans-serif' 
                      }}
                    >
                      Xem chi tiết nhà hàng
                    </Button>
                  </Link>
                  <Link href="/restaurants" className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                      style={{ 
                        borderRadius: borderRadius.button,
                        fontFamily: 'system-ui, -apple-system, sans-serif' 
                      }}
                    >
                      Xem nhà hàng khác
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <div className="text-center text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <p>Email xác nhận đã được gửi đến địa chỉ email của bạn.</p>
            <p className="mt-2">
              Cần trợ giúp? Liên hệ{" "}
              <a href="#" className="hover:underline" style={{ color: colors.primary }}>
                hỗ trợ nhà hàng
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}








