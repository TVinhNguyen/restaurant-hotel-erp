"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, Star, Clock, Ban, Loader2, User, Mail, Phone, FileText, ArrowRight, Calendar, Users, Bed, Tag, X } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import BookingFormSkeleton from "@/components/skeletons/BookingFormSkeleton"
import { colors, shadows, borderRadius } from "@/lib/designTokens"
import { propertiesService } from "@/lib/services/properties"
import { ratePlansService } from "@/lib/services/rate-plans"
import { guestsService } from "@/lib/services/guests"
import { reservationsService, type CreateReservationRequest } from "@/lib/services/reservations"
import { promotionsService, type PromotionApplyResult } from "@/lib/services/promotions"
import { authService } from "@/lib/auth"
import { showToast } from "@/lib/toast"
import { paymentService } from "@/lib/services/payments"

const bookingFormSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập họ"),
  lastName: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  guestNotes: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingFormSchema>

export default function BookingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [property, setProperty] = useState<{ id: string; name: string; images?: string[]; address?: string; rating?: number; city?: string; country?: string } | null>(null)
  const [roomType, setRoomType] = useState<{ id: string; name: string; basePrice: number | string } | null>(null)
  const [bookingDates, setBookingDates] = useState<{ checkin: string; checkout: string; guests: number; rooms?: number } | null>(null)
  const [bookingContext, setBookingContext] = useState<{ propertyId: string; roomTypeId: string; roomId?: string } | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [nights, setNights] = useState(0)
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false)
  const [promotionCode, setPromotionCode] = useState("")
  const [appliedPromotion, setAppliedPromotion] = useState<PromotionApplyResult | null>(null)
  const [isValidatingPromotion, setIsValidatingPromotion] = useState(false)
  const [subtotal, setSubtotal] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [serviceAmount, setServiceAmount] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const router = useRouter()

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      guestNotes: "",
    },
  })

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true)
        setHasCheckedStorage(false)
        
        // Get booking context and dates from localStorage
        const contextStr = localStorage.getItem("booking_context")
        const datesStr = localStorage.getItem("booking_dates")
        
        console.log("Booking context:", contextStr)
        console.log("Booking dates:", datesStr)
        
        if (!contextStr || !datesStr) {
          console.warn("Missing booking data, redirecting to properties")
          setHasCheckedStorage(true)
          router.push("/properties")
          return
        }

        let context: { propertyId: string; roomTypeId: string; roomId?: string }
        let dates: { checkin: string; checkout: string; guests: number; rooms?: number }
        
        try {
          context = JSON.parse(contextStr)
          dates = JSON.parse(datesStr)
        } catch (parseErr) {
          console.error("Failed to parse booking data:", parseErr)
          setError("Dữ liệu đặt phòng không hợp lệ. Vui lòng bắt đầu lại.")
          setHasCheckedStorage(true)
          return
        }
        
        // Validate required fields
        if (!context.propertyId) {
          console.error("Missing propertyId in context")
          setError("Thiếu thông tin khách sạn. Vui lòng bắt đầu lại.")
          setHasCheckedStorage(true)
          router.push("/properties")
          return
        }
        
        setBookingContext(context)
        setBookingDates(dates)

        // Fetch property
        if (context.propertyId) {
          const prop = await propertiesService.getPropertyById(context.propertyId)
          setProperty(prop)
        }

        // Fetch room types (only for display)
        let rt: { id: string; name: string; basePrice: number | string } | null = null
        if (context.roomTypeId) {
          try {
            const roomTypes = await propertiesService.getRoomTypes(context.propertyId)
            rt = roomTypes.find((r) => r.id === context.roomTypeId) || null
            if (rt) {
              setRoomType(rt)
            } else {
              console.warn("Room type not found, trying to get first available room type")
              // If roomTypeId not found, try to get first available room type
              if (roomTypes.length > 0) {
                rt = roomTypes[0]
                setRoomType(rt)
                // Update context with first room type
                context.roomTypeId = rt.id
                localStorage.setItem("booking_context", JSON.stringify(context))
              }
            }
          } catch (err) {
            console.error("Failed to load room types:", err)
            // Continue without room type, will show error later
          }
        } else {
          // If no roomTypeId, try to get first available room type
          try {
            const roomTypes = await propertiesService.getRoomTypes(context.propertyId)
            if (roomTypes.length > 0) {
              rt = roomTypes[0]
              setRoomType(rt)
              // Update context with first room type
              context.roomTypeId = rt.id
              localStorage.setItem("booking_context", JSON.stringify(context))
            }
          } catch (err) {
            console.error("Failed to load room types:", err)
          }
        }

        // Calculate nights and price (for display only)
        if (dates.checkin && dates.checkout && rt) {
          const checkIn = new Date(dates.checkin)
          const checkOut = new Date(dates.checkout)
          const diffTime = checkOut.getTime() - checkIn.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          setNights(diffDays)

          // Calculate total price (base price * nights + tax + service) - for display only
          if (rt.basePrice) {
            const basePrice = typeof rt.basePrice === 'string' ? parseFloat(rt.basePrice) : rt.basePrice
            const calculatedSubtotal = basePrice * diffDays
            const tax = calculatedSubtotal * 0.1 // 10% tax
            const service = calculatedSubtotal * 0.05 // 5% service fee
            setSubtotal(calculatedSubtotal)
            setTaxAmount(tax)
            setServiceAmount(service)
            setTotalPrice(calculatedSubtotal + tax + service)
            // Reset discount when recalculating from scratch
            if (!appliedPromotion) {
              setDiscountAmount(0)
            }
          }
        }

        // Pre-fill form with user data if logged in
        if (authService.isAuthenticated()) {
          try {
            const user = await authService.getCurrentUser()
            if (user.email) {
              form.setValue("email", user.email)
            }
            if (user.name) {
              const nameParts = user.name.split(" ")
              if (nameParts.length > 0) {
                form.setValue("firstName", nameParts[0])
                if (nameParts.length > 1) {
                  form.setValue("lastName", nameParts.slice(1).join(" "))
                }
              }
            }
            if (user.phone) {
              form.setValue("phone", user.phone)
            }
          } catch (err) {
            console.error("Failed to load user data:", err)
          }
        }

        // Mark as checked only after all data is loaded
        setHasCheckedStorage(true)
      } catch (err) {
        console.error("Failed to load booking data:", err)
        setError("Không thể tải thông tin đặt phòng. Vui lòng thử lại.")
        setHasCheckedStorage(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadBookingData()
  }, [router, form])

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim() || !bookingContext || !roomType) {
      showToast.error("Vui lòng nhập mã khuyến mãi")
      return
    }

    setIsValidatingPromotion(true)
    try {
      const basePrice = typeof roomType.basePrice === 'string' ? parseFloat(roomType.basePrice) : roomType.basePrice
      const calculatedSubtotal = basePrice * nights
      
      const result = await promotionsService.applyPromotion(
        promotionCode.trim().toUpperCase(),
        bookingContext.propertyId,
        calculatedSubtotal
      )

      if (result.valid) {
        setAppliedPromotion(result)
        setDiscountAmount(result.discountAmount)
        // Recalculate total with discount
        const newSubtotal = calculatedSubtotal - result.discountAmount
        const tax = newSubtotal * 0.1
        const service = newSubtotal * 0.05
        setTaxAmount(tax)
        setServiceAmount(service)
        setTotalPrice(newSubtotal + tax + service)
        showToast.success(result.message)
      } else {
        setAppliedPromotion(null)
        setDiscountAmount(0)
        // Reset to original price
        const tax = calculatedSubtotal * 0.1
        const service = calculatedSubtotal * 0.05
        setTaxAmount(tax)
        setServiceAmount(service)
        setTotalPrice(calculatedSubtotal + tax + service)
        showToast.error(result.message || "Mã khuyến mãi không hợp lệ")
      }
    } catch (err) {
      console.error("Failed to apply promotion:", err)
      showToast.error("Không thể áp dụng mã khuyến mãi. Vui lòng thử lại.")
    } finally {
      setIsValidatingPromotion(false)
    }
  }

  const handleRemovePromotion = () => {
    setPromotionCode("")
    setAppliedPromotion(null)
    setDiscountAmount(0)
    // Reset to original price
    const basePrice = typeof roomType.basePrice === 'string' ? parseFloat(roomType.basePrice) : roomType.basePrice
    const calculatedSubtotal = basePrice * nights
    const tax = calculatedSubtotal * 0.1
    const service = calculatedSubtotal * 0.05
    setTaxAmount(tax)
    setServiceAmount(service)
    setTotalPrice(calculatedSubtotal + tax + service)
  }

  const onSubmit = async (data: BookingFormValues) => {
    if (!bookingContext || !bookingDates || !property || !roomType) {
      setError("Thiếu thông tin đặt phòng. Vui lòng bắt đầu lại.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Fetch rate plan when submitting (not on page load)
      let ratePlanData: { id: string; currency: string } | null = null
      if (bookingContext.roomTypeId) {
        const ratePlans = await ratePlansService.getRatePlans({
          propertyId: bookingContext.propertyId,
          roomTypeId: bookingContext.roomTypeId,
          limit: 1,
        })
        if (ratePlans.data && ratePlans.data.length > 0) {
          ratePlanData = ratePlans.data[0]
        } else {
          throw new Error("Không tìm thấy gói giá cho loại phòng này")
        }
      } else {
        throw new Error("Thiếu thông tin loại phòng")
      }

      // Get current user if logged in
      let bookerUserId: string | undefined
      let user: { id: string; email: string; name?: string; phone?: string } | null = null
      
      if (authService.isAuthenticated()) {
        try {
          user = await authService.getCurrentUser()
          bookerUserId = user.id
        } catch (err) {
          console.error("Failed to get user ID:", err)
        }
      }

      // Find or create guest
      let guestId: string
      try {
        // If user is logged in, use user's email to find/create guest
        const emailToSearch = user?.email || data.email
        
        const existingGuest = await guestsService.findGuestByEmail(emailToSearch)
        if (existingGuest) {
          guestId = existingGuest.id
        } else {
          // Create guest from user info if logged in, otherwise from form data
          const guestData = user 
            ? {
                name: user.name || `${data.firstName} ${data.lastName}`.trim(),
                email: user.email,
                phone: user.phone || data.phone,
              }
            : {
                name: `${data.firstName} ${data.lastName}`.trim(),
                email: data.email,
                phone: data.phone,
              }
          
          const newGuest = await guestsService.createGuest(guestData)
          guestId = newGuest.id
        }
      } catch (err) {
        console.error("Failed to create/find guest:", err)
        throw new Error("Không thể xử lý thông tin khách hàng")
      }

      const basePrice = typeof roomType.basePrice === 'string' ? parseFloat(roomType.basePrice) : roomType.basePrice
      const calculatedSubtotal = basePrice * nights
      const finalSubtotal = calculatedSubtotal - discountAmount
      const finalTaxAmount = finalSubtotal * 0.1
      const finalServiceAmount = finalSubtotal * 0.05
      const finalTotal = finalSubtotal + finalTaxAmount + finalServiceAmount

      const reservationPayload: CreateReservationRequest = {
        propertyId: bookingContext.propertyId,
        guestId: guestId,
        roomTypeId: bookingContext.roomTypeId,
        ratePlanId: ratePlanData.id,
        checkIn: bookingDates.checkin,
        checkOut: bookingDates.checkout,
        adults: bookingDates.guests || 2,
        children: 0,
        totalAmount: finalTotal,
        currency: ratePlanData.currency || "USD",
        contactName: `${data.firstName} ${data.lastName}`.trim(),
        contactEmail: data.email,
        contactPhone: data.phone,
        guestNotes: data.guestNotes,
        channel: "website",
        bookerUserId: bookerUserId,
        assignedRoomId: bookingContext.roomId,
        taxAmount: finalTaxAmount,
        serviceAmount: finalServiceAmount,
        discountAmount: discountAmount,
        promotionId: appliedPromotion?.promotionId,
      }

      const amountInVND =
        reservationPayload.currency === "USD"
          ? Math.round(finalTotal * 25000)
          : Math.round(finalTotal)

      const description = `Thanh toán #${property.name}`.slice(0, 25)
      const orderId = Date.now()

      const paymentResponse = await paymentService.createPayment(amountInVND, description, orderId)

      const finalOrderId = paymentResponse.orderId ?? orderId

      if (typeof window !== "undefined") {
        localStorage.setItem("pending_reservation_payload", JSON.stringify(reservationPayload))
        localStorage.setItem("payment_orderId", String(finalOrderId))
      }

      const checkoutUrl =
        paymentResponse.data?.checkoutUrl ||
        (paymentResponse as any).data?.data?.checkoutUrl ||
        (paymentResponse as any).checkoutUrl

      if (!checkoutUrl) {
        throw new Error("Không nhận được checkout URL từ PayOS. Vui lòng thử lại.")
      }

      paymentService.redirectToPayOS(checkoutUrl)
      } catch (err) {
      console.error("Booking error:", err)
      setError(err instanceof Error ? err.message : "Không thể hoàn tất đặt phòng. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (isLoading || !hasCheckedStorage) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <BookingFormSkeleton />
        </div>
        <Footer />
      </div>
    )
  }

  if (!property || !roomType || !bookingDates) {
    // Only show error if we've checked storage and data is missing
    if (hasCheckedStorage) {
      return (
        <div style={{ backgroundColor: colors.background }} className="min-h-screen">
          <Header />
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }} className="mb-4">
              Thiếu thông tin đặt phòng
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
    // Still loading, show loader
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
      </div>
    )
  }

  const basePrice = typeof roomType.basePrice === 'string' ? parseFloat(roomType.basePrice) : roomType.basePrice

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center space-x-4 mb-6">
          {bookingContext && (
            <Link href={`/property/${bookingContext.propertyId}`}>
              <Button variant="ghost" size="sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
          )}
        </div>

        <h2 className="text-3xl font-bold mb-8" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Đặt phòng {property.name}
        </h2>

        {error && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Data */}
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: borderRadius.card,
                    boxShadow: shadows.card,
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: colors.lightBlue }}>
                      <User className="w-5 h-5" style={{ color: colors.primary }} />
                    </div>
                    <h2 className="text-xl font-bold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Thông tin khách hàng
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Họ
                          </FormLabel>
                          <FormControl>
                            <input
                              type="text"
                              placeholder="Nguyễn"
                              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                              style={{
                                borderRadius: borderRadius.input,
                                borderColor: colors.border,
                                boxShadow: shadows.input,
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Tên
                          </FormLabel>
                          <FormControl>
                            <input
                              type="text"
                              placeholder="Văn A"
                              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                              style={{
                                borderRadius: borderRadius.input,
                                borderColor: colors.border,
                                boxShadow: shadows.input,
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.primary }} />
                              <input
                                type="email"
                                placeholder="email@example.com"
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                style={{
                                  borderRadius: borderRadius.input,
                                  borderColor: colors.border,
                                  boxShadow: shadows.input,
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                }}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Số điện thoại
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.primary }} />
                              <input
                                type="tel"
                                placeholder="+84 123 456 789"
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                style={{
                                  borderRadius: borderRadius.input,
                                  borderColor: colors.border,
                                  boxShadow: shadows.input,
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                }}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="guestNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Yêu cầu đặc biệt (tùy chọn)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <FileText className="absolute left-4 top-4 w-5 h-5" style={{ color: colors.primary }} />
                              <textarea
                                placeholder="Bất kỳ yêu cầu đặc biệt nào..."
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all min-h-[100px]"
                                style={{
                                  borderRadius: borderRadius.input,
                                  borderColor: colors.border,
                                  boxShadow: shadows.input,
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                }}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* House Rules */}
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: borderRadius.card,
                    boxShadow: shadows.card,
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Quy định khách sạn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: colors.lightBlue }}>
                        <Clock className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Giờ nhận phòng
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Từ 15:00
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: colors.lightBlue }}>
                        <Clock className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Giờ trả phòng
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Trước 11:00
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Ban className="h-5 w-5" style={{ color: "#DC2626" }} />
                      <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Không cho phép thú cưng
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ban className="h-5 w-5" style={{ color: "#DC2626" }} />
                      <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Không hút thuốc
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ban className="h-5 w-5" style={{ color: "#DC2626" }} />
                      <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Không tiệc tùng
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.button,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Chuyển đến trang thanh toán
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div
              className="bg-white p-6 sticky top-24"
              style={{
                borderRadius: borderRadius.card,
                boxShadow: shadows.cardHover,
              }}
            >
              <div className="space-y-6">
                {/* Property Image */}
                <div className="relative">
                  <img
                    src={getImageUrl(property.images)}
                    alt={property.name}
                    className="w-full h-48 object-cover"
                    style={{ borderRadius: borderRadius.image }}
                  />
                </div>

                {/* Property Info */}
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {property.name}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {getLocationText()}
                  </p>
                  {property.rating && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-lg w-fit" style={{ backgroundColor: colors.lightBlue }}>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                        {property.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6" style={{ borderColor: colors.border }}>
                  <h4 className="font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {roomType.name}
                  </h4>
                  <div className="space-y-3 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Nhận phòng: {new Date(bookingDates.checkin).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Trả phòng: {new Date(bookingDates.checkout).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{bookingDates.guests || 2} khách</span>
                    </div>
                    {bookingDates.rooms && (
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4" />
                        <span>{bookingDates.rooms} phòng</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>{nights} đêm</span>
                    </div>
                  </div>
                </div>

                {/* Promotion Code */}
                <div className="border-t pt-6" style={{ borderColor: colors.border }}>
                  <h4 className="font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Mã khuyến mãi
                  </h4>
                  {appliedPromotion ? (
                    <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: colors.lightBlue }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" style={{ color: colors.primary }} />
                          <span className="font-semibold" style={{ color: colors.textPrimary }}>
                            {appliedPromotion.code}
                          </span>
                        </div>
                        <button
                          onClick={handleRemovePromotion}
                          className="p-1 rounded hover:bg-white/50 transition-colors"
                        >
                          <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
                        </button>
                      </div>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Giảm {appliedPromotion.discountPercent}% - {appliedPromotion.discountAmount.toFixed(2)} USD
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập mã khuyến mãi"
                        value={promotionCode}
                        onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleApplyPromotion()
                          }
                        }}
                        className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderRadius: borderRadius.input,
                          borderColor: colors.border,
                          boxShadow: shadows.input,
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleApplyPromotion}
                        disabled={isValidatingPromotion || !promotionCode.trim()}
                        className="px-4"
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: borderRadius.button,
                        }}
                      >
                        {isValidatingPromotion ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Áp dụng"
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6" style={{ borderColor: colors.border }}>
                  <h4 className="font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Chi tiết giá
                  </h4>
                  <div className="space-y-2 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <div className="flex justify-between" style={{ color: colors.textSecondary }}>
                      <span>Giá mỗi đêm</span>
                      <span>${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: colors.textSecondary }}>
                      <span>{nights} đêm</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between" style={{ color: colors.success }}>
                        <span>Giảm giá</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between" style={{ color: colors.textSecondary }}>
                      <span>Thuế (10%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: colors.textSecondary }}>
                      <span>Phí dịch vụ (5%)</span>
                      <span>${serviceAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2" style={{ borderColor: colors.border }}>
                      <div className="flex justify-between font-bold text-lg" style={{ color: colors.textPrimary }}>
                        <span>TỔNG CỘNG</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
