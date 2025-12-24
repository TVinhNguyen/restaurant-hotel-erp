"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar, MapPin, User as UserIcon, Heart, Settings, LogOut, X, Loader2, CheckCircle, XCircle, Clock, ChevronRight, KeyRound, Utensils } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { authService, type User } from "@/lib/auth"
import { reservationsService, type Reservation, type TableBooking } from "@/lib/services/reservations"
import { guestsService } from "@/lib/services/guests"
import { colors, shadows, borderRadius } from "@/lib/designTokens"
import { showToast } from "@/lib/toast"

type TabType = "bookings" | "table-bookings" | "personal"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("bookings")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [tableBookings, setTableBookings] = useState<TableBooking[]>([])
  const [loadingReservations, setLoadingReservations] = useState(false)
  const [loadingTableBookings, setLoadingTableBookings] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error("Failed to load user:", error)
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
      setIsLoading(false)
    }

    loadUser()
  }, [router])

  useEffect(() => {
    if (activeTab === "bookings" && user) {
      loadReservations()
    } else if (activeTab === "table-bookings" && user) {
      loadTableBookings()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user])
  
  const loadReservations = async () => {
    if (!user) return
    
    setLoadingReservations(true)
    try {
      // Find guest by user email
      const guest = await guestsService.findGuestByEmail(user.email)
      
      if (guest) {
        const response = await reservationsService.getReservations({
          guestId: guest.id,
          limit: 50,
        })
        
        // Gọi API by ID để lấy đầy đủ thông tin property, roomType, guest
        const detailedReservations = await Promise.all(
          (response.data || []).map(async (reservation) => {
            try {
              const detailed = await reservationsService.getReservationById(reservation.id)
              return detailed
            } catch (error) {
              console.error(`Failed to load reservation ${reservation.id}:`, error)
              return reservation // Fallback to original data
            }
          })
        )
        setReservations(detailedReservations)
      }
    } catch (error) {
      console.error("Failed to load reservations:", error)
    } finally {
      setLoadingReservations(false)
    }
  }

  const loadTableBookings = async () => {
    if (!user) return
    
    setLoadingTableBookings(true)
    try {
      // Find guest by user email
      const guest = await guestsService.findGuestByEmail(user.email)
      
      if (guest) {
        const response = await reservationsService.getTableBookings({
          guestId: guest.id,
          limit: 50,
        })
        // Backend may return { data: [] } or { bookings: [] }
        const bookings = response.data || response.bookings || []
        setTableBookings(bookings)
      }
    } catch (error) {
      console.error("Failed to load table bookings:", error)
    } finally {
      setLoadingTableBookings(false)
    }
  }

  const handleCancelBookingClick = (reservationId: string) => {
    setReservationToCancel(reservationId)
    setCancelDialogOpen(true)
  }

  const handleCancelBooking = async () => {
    if (!reservationToCancel) return

    setCancellingId(reservationToCancel)
    setCancelDialogOpen(false)
    
    try {
      await reservationsService.cancelReservation(reservationToCancel)
      await loadReservations()
      showToast.success("Hủy đặt phòng thành công!")
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : "Hủy đặt phòng thất bại")
    } finally {
      setCancellingId(null)
      setReservationToCancel(null)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return {
          label: "Đã xác nhận",
          color: colors.primary,
          bgColor: colors.lightBlue,
          icon: CheckCircle,
        }
      case "pending":
        return {
          label: "Đang chờ",
          color: colors.accent,
          bgColor: "#FFF5E6",
          icon: Clock,
        }
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "#E53E3E",
          bgColor: "#FFF5F5",
          icon: XCircle,
        }
      case "checked_in":
        return {
          label: "Đã nhận phòng",
          color: colors.success,
          bgColor: "#F0FFF4",
          icon: CheckCircle,
        }
      case "checked_out":
        return {
          label: "Đã trả phòng",
          color: colors.textSecondary,
          bgColor: colors.background,
          icon: CheckCircle,
        }
      default:
        return {
          label: status,
          color: colors.textSecondary,
          bgColor: colors.background,
          icon: Clock,
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getImageUrl = (
    roomType?: { photos?: Array<{ url: string }> },
    property?: { images?: string[] }
  ) => {
    // Ưu tiên lấy ảnh từ roomType trước
    if (roomType?.photos && roomType.photos.length > 0) {
      return roomType.photos[0].url
    }
    
    // Nếu không có ảnh roomType, lấy từ property
    if (property?.images && property.images.length > 0) {
      return property.images[0]
    }
    
    // Fallback ảnh mặc định
    const fallbacks = [
      "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
      "/modern-hotel-room-with-city-view-london.jpg",
      "/modern-green-hotel-building-exterior.jpg",
      "/dark-modern-hotel-room-with-ambient-lighting.jpg",
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)] || "/placeholder.svg"
  }

  if (isLoading) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside>
            <div
              className="bg-white p-6"
              style={{
                borderRadius: borderRadius.card,
                boxShadow: shadows.card,
              }}
            >
              <div className="text-center mb-6 pb-6 border-b" style={{ borderColor: colors.border }}>
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: colors.lightBlue }}
                >
                  <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {getInitials(user.name)}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {user.name || "User"}
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {user.email}
                </p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                    activeTab === "bookings" ? "font-semibold" : ""
                  }`}
                  style={{
                    backgroundColor: activeTab === "bookings" ? colors.lightBlue : "transparent",
                    color: activeTab === "bookings" ? colors.primary : colors.textSecondary,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Đặt phòng của tôi</span>
                </button>

                <button
                  onClick={() => setActiveTab("table-bookings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                    activeTab === "table-bookings" ? "font-semibold" : ""
                  }`}
                  style={{
                    backgroundColor: activeTab === "table-bookings" ? colors.lightBlue : "transparent",
                    color: activeTab === "table-bookings" ? colors.primary : colors.textSecondary,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  <Utensils className="w-5 h-5" />
                  <span>Đặt bàn của tôi</span>
                </button>

                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                    activeTab === "personal" ? "font-semibold" : ""
                  }`}
                  style={{
                    backgroundColor: activeTab === "personal" ? colors.lightBlue : "transparent",
                    color: activeTab === "personal" ? colors.primary : colors.textSecondary,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  <Settings className="w-5 h-5" />
                  <span>Cài đặt</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:opacity-70 cursor-pointer"
                  style={{
                    color: colors.textSecondary,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "bookings" ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Đặt phòng của tôi
                  </h2>
                  <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Quản lý và theo dõi các đặt phòng của bạn
                  </p>
                </div>

                {loadingReservations ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
                  </div>
                ) : reservations.length === 0 ? (
                  <div
                    className="bg-white p-12 text-center"
                    style={{
                      borderRadius: borderRadius.card,
                      boxShadow: shadows.card,
                    }}
                  >
                    <div
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: colors.lightBlue }}
                    >
                      <Calendar className="w-10 h-10" style={{ color: colors.primary }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Chưa có đặt phòng
                    </h3>
                    <p className="mb-6" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Hãy đặt phòng đầu tiên của bạn ngay hôm nay
                    </p>
                    <Link href="/properties">
                      <Button
                        className="px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: borderRadius.button,
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                      >
                        Khám phá ngay
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => {
                      const statusConfig = getStatusConfig(reservation.status)
                      const StatusIcon = statusConfig.icon

                      return (
                        <div
                          key={reservation.id}
                          className="bg-white p-6 hover:shadow-lg transition-all"
                          style={{
                            borderRadius: borderRadius.card,
                            boxShadow: shadows.card,
                          }}
                        >
                          <div className="flex gap-6">
                            <img
                              src={getImageUrl(reservation.roomType, reservation.property)}
                              alt={reservation.roomType?.name || reservation.property?.name || "Property"}
                              className="w-48 h-32 object-cover flex-shrink-0"
                              style={{ borderRadius: borderRadius.image }}
                            />

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    {reservation.property?.name || "Property"}
                                  </h3>
                                  {reservation.roomType && (
                                    <p className="text-sm mb-2" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {reservation.roomType.name}
                                    </p>
                                  )}
                                  {reservation.confirmationCode && (
                                    <p className="text-xs mb-2" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Mã xác nhận: {reservation.confirmationCode}
                                    </p>
                                  )}
                                </div>
                                <div
                                  className="flex items-center gap-2 px-3 py-1 rounded-lg"
                                  style={{
                                    backgroundColor: statusConfig.bgColor,
                                    color: statusConfig.color,
                                  }}
                                >
                                  <StatusIcon className="w-4 h-4" />
                                  <span className="text-sm font-medium">{statusConfig.label}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" style={{ color: colors.textSecondary }} />
                                  <div>
                                    <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Nhận phòng
                                    </p>
                                    <p className="text-sm font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {formatDate(reservation.checkIn)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" style={{ color: colors.textSecondary }} />
                                  <div>
                                    <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Trả phòng
                                    </p>
                                    <p className="text-sm font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {formatDate(reservation.checkOut)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {reservation.property?.address && (
                                <div className="flex items-center gap-2 mb-4">
                                  <MapPin className="w-4 h-4" style={{ color: colors.textSecondary }} />
                                  <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    {reservation.property.address}
                                  </p>
                                </div>
                              )}

                              <div
                                className="flex items-center justify-between pt-4 border-t"
                                style={{ borderColor: colors.border }}
                              >
                                <div>
                                  <p className="text-xs mb-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    Tổng thanh toán
                                  </p>
                                  <p className="text-xl font-bold mb-2" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    {typeof reservation.totalAmount === "number"
                                      ? reservation.totalAmount.toLocaleString("vi-VN")
                                      : typeof reservation.totalAmount === "string"
                                      ? parseFloat(reservation.totalAmount).toLocaleString("vi-VN")
                                      : "0"}
                                    đ
                                  </p>
                                  {/* Payment Status Badge */}
                                  {reservation.paymentStatus && (
                                    <div
                                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium"
                                      style={{
                                        backgroundColor: 
                                          reservation.paymentStatus === 'paid' 
                                            ? '#10B981' 
                                            : reservation.paymentStatus === 'unpaid'
                                            ? '#F59E0B'
                                            : reservation.paymentStatus === 'partial'
                                            ? '#3B82F6'
                                            : '#6B7280',
                                        color: '#FFFFFF',
                                      }}
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                      {reservation.paymentStatus === 'paid' 
                                        ? 'Đã thanh toán' 
                                        : reservation.paymentStatus === 'unpaid'
                                        ? 'Chưa thanh toán'
                                        : reservation.paymentStatus === 'partial'
                                        ? 'Thanh toán một phần'
                                        : 'Đã hoàn tiền'}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Only show cancel button if not cancelled, not checked_out, and not paid */}
                                  {reservation.status !== "cancelled" &&
                                    reservation.status !== "checked_out" &&
                                    reservation.paymentStatus !== "paid" && (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleCancelBookingClick(reservation.id)}
                                        disabled={cancellingId === reservation.id}
                                        className="flex items-center gap-2"
                                        style={{
                                          fontFamily: 'system-ui, -apple-system, sans-serif',
                                        }}
                                      >
                                        {cancellingId === reservation.id ? (
                                          <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Đang hủy...
                                          </>
                                        ) : (
                                          <>
                                            <X className="h-4 w-4" />
                                            Hủy đặt phòng
                                          </>
                                        )}
                                      </Button>
                                    )}
                                  {/* Show message if paid and cannot cancel */}
                                  {reservation.paymentStatus === "paid" && 
                                    reservation.status !== "cancelled" &&
                                    reservation.status !== "checked_out" && (
                                      <div className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: colors.lightBlue, color: colors.textSecondary }}>
                                        💳 Đã thanh toán - không thể hủy
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : activeTab === "table-bookings" ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Đặt bàn của tôi
                  </h2>
                  <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Quản lý và theo dõi các đặt bàn nhà hàng của bạn
                  </p>
                </div>

                {loadingTableBookings ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
                  </div>
                ) : tableBookings.length === 0 ? (
                  <div
                    className="bg-white p-12 text-center"
                    style={{
                      borderRadius: borderRadius.card,
                      boxShadow: shadows.card,
                    }}
                  >
                    <div
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: colors.lightBlue }}
                    >
                      <Utensils className="w-10 h-10" style={{ color: colors.primary }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Chưa có đặt bàn
                    </h3>
                    <p className="mb-6" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Hãy đặt bàn nhà hàng đầu tiên của bạn ngay hôm nay
                    </p>
                    <Link href="/restaurants">
                      <Button
                        className="px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: borderRadius.button,
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                      >
                        Khám phá nhà hàng
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tableBookings.map((booking) => {
                      const bookingDate = new Date(booking.bookingDate)
                      const formattedDate = bookingDate.toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })

                      return (
                        <div
                          key={booking.id}
                          className="bg-white overflow-hidden"
                          style={{
                            borderRadius: borderRadius.card,
                            boxShadow: shadows.card,
                          }}
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: colors.lightBlue }}
                                >
                                  <Utensils className="w-6 h-6" style={{ color: colors.primary }} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Đặt bàn nhà hàng
                                    </h3>
                                    <Badge
                                      style={{
                                        backgroundColor: booking.status === 'confirmed' ? '#10b981' : 
                                                       booking.status === 'pending' ? '#f59e0b' :
                                                       booking.status === 'cancelled' ? '#ef4444' : '#6b7280',
                                        color: '#FFFFFF',
                                      }}
                                    >
                                      {booking.status === 'confirmed' ? 'Đã xác nhận' :
                                       booking.status === 'pending' ? 'Chờ xác nhận' :
                                       booking.status === 'cancelled' ? 'Đã hủy' :
                                       booking.status === 'completed' ? 'Hoàn thành' : booking.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      <span>{formattedDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      <span>Giờ: {booking.bookingTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <UserIcon className="w-4 h-4" />
                                      <span>{booking.pax || booking.numberOfGuests} khách</span>
                                    </div>
                                    {booking.specialRequests && (
                                      <div className="mt-2 p-2 rounded" style={{ backgroundColor: colors.lightBlue }}>
                                        <span className="text-xs">Yêu cầu: {booking.specialRequests}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Cài đặt tài khoản
                  </h2>
                  <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Quản lý thông tin cá nhân và bảo mật
                  </p>
                </div>

                {/* Personal Information Card */}
                <div
                  className="bg-white p-6 mb-6"
                  style={{
                    borderRadius: borderRadius.card,
                    boxShadow: shadows.card,
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Thông tin cá nhân
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name || ""}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                        style={{
                          borderRadius: borderRadius.input,
                          borderColor: colors.border,
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                        style={{
                          borderRadius: borderRadius.input,
                          borderColor: colors.border,
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                        readOnly
                      />
                    </div>

                    {user.phone && (
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          defaultValue={user.phone}
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                          style={{
                            borderRadius: borderRadius.input,
                            borderColor: colors.border,
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                          }}
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Settings Card */}
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: borderRadius.card,
                    boxShadow: shadows.card,
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Bảo mật
                  </h3>

                  <div className="space-y-3">
                    <Link href="/change-password">
                      <div
                        className="flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-all cursor-pointer"
                        style={{ 
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: colors.lightBlue }}
                          >
                            <KeyRound className="w-5 h-5" style={{ color: colors.primary }} />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Đổi mật khẩu
                            </p>
                            <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Cập nhật mật khẩu của bạn
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Cancel Booking Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: colors.textPrimary }}>
              Xác nhận hủy đặt phòng
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: colors.textSecondary }}>
              Bạn có chắc chắn muốn hủy đặt phòng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setCancelDialogOpen(false)
                setReservationToCancel(null)
              }}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              disabled={cancellingId !== null}
              className="bg-red-600 hover:bg-red-700"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {cancellingId ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận hủy'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
