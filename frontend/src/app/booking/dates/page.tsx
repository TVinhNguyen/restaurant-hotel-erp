"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar, Users, Bed, ArrowRight, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { colors, shadows, borderRadius } from "@/lib/designTokens"
import { propertiesService, type Property, type RoomType } from "@/lib/services/properties"
import { showToast } from "@/lib/toast"

const bookingDatesSchema = z.object({
  checkin: z.string().min(1, "Vui lòng chọn ngày nhận phòng"),
  checkout: z.string().min(1, "Vui lòng chọn ngày trả phòng"),
  adults: z.number().min(1, "Ít nhất 1 người lớn").max(10, "Tối đa 10 người lớn"),
  children: z.number().min(0, "Số trẻ em không hợp lệ").max(10, "Tối đa 10 trẻ em"),
}).refine((data) => {
  if (!data.checkin || !data.checkout) return true
  const checkinDate = new Date(data.checkin)
  const checkoutDate = new Date(data.checkout)
  return checkoutDate > checkinDate
}, {
  message: "Ngày trả phòng phải sau ngày nhận phòng",
  path: ["checkout"],
})

type BookingDatesFormValues = z.infer<typeof bookingDatesSchema>

// Helper function to get amenity names from room type
const getAmenityNames = (roomType: RoomType): string[] => {
  const amenitiesList = roomType.roomTypeAmenities || roomType.amenities || []
  const names: string[] = []
  
  if (Array.isArray(amenitiesList)) {
    amenitiesList.forEach((amenity) => {
      if (typeof amenity === 'object' && amenity !== null && 'amenity' in amenity) {
        const roomTypeAmenity = amenity as any
        if (roomTypeAmenity.amenity?.name) {
          names.push(roomTypeAmenity.amenity.name)
        }
      } else if (typeof amenity === 'string') {
        names.push(amenity)
      }
    })
  }
  
  return names
}

export default function BookingDatesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProperty, setLoadingProperty] = useState(true)
  const [property, setProperty] = useState<Property | null>(null)
  const [roomType, setRoomType] = useState<RoomType | null>(null)
  const router = useRouter()

  // ✅ Load saved dates for form default values
  const getSavedDates = () => {
    try {
      const savedDatesStr = localStorage.getItem("booking_dates")
      if (savedDatesStr) {
        return JSON.parse(savedDatesStr)
      }
    } catch (err) {
      console.error("Failed to load saved dates:", err)
    }
    return null
  }

  const savedDates = getSavedDates()
  
  const form = useForm<BookingDatesFormValues>({
    resolver: zodResolver(bookingDatesSchema),
    defaultValues: {
      checkin: savedDates?.checkin || "",
      checkout: savedDates?.checkout || "",
      adults: savedDates?.adults || 1,
      children: savedDates?.children || 0,
    },
  })

  useEffect(() => {
    const loadPropertyAndRoomType = async () => {
      try {
        const contextStr = localStorage.getItem("booking_context")
        if (!contextStr) {
          router.push("/properties")
          return
        }

        const context = JSON.parse(contextStr)
        if (context.propertyId) {
          const prop = await propertiesService.getPropertyById(context.propertyId)
          setProperty(prop)

          // Load room type if specified
          if (context.roomTypeId) {
            try {
              const roomTypes = await propertiesService.getRoomTypes(context.propertyId)
              const selectedRoomType = roomTypes.find(rt => rt.id === context.roomTypeId)
              if (selectedRoomType) {
                setRoomType(selectedRoomType)
              }
            } catch (err) {
              console.error("Failed to load room type:", err)
            }
          }
        }
      } catch (err) {
        console.error("Failed to load property:", err)
      } finally {
        setLoadingProperty(false)
      }
    }

    loadPropertyAndRoomType()
  }, [router])

  const onSubmit = async (data: BookingDatesFormValues) => {
    setIsLoading(true)
    try {
      // Ensure data is saved to localStorage before redirect
      localStorage.setItem("booking_dates", JSON.stringify(data))
      
      // Small delay to ensure localStorage is written
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Verify data was saved
      const saved = localStorage.getItem("booking_dates")
      if (!saved) {
        throw new Error("Không thể lưu thông tin đặt phòng")
      }
      
      router.push("/booking")
    } catch (err) {
      console.error("Failed to save booking dates:", err)
      showToast.error("Không thể lưu thông tin đặt phòng", "Vui lòng thử lại")
    } finally {
      setIsLoading(false)
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

  if (loadingProperty) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <BackButton variant="ghost" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div
              className="bg-white p-8"
              style={{
                borderRadius: borderRadius.card,
                boxShadow: shadows.card,
              }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Chọn ngày và số khách
                </h1>
                <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {property ? `Đặt phòng tại ${property.name}` : "Vui lòng chọn ngày nhận phòng và trả phòng"}
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="checkin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Ngày nhận phòng
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.primary }} />
                              <input
                                type="date"
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                style={{
                                  borderRadius: borderRadius.input,
                                  borderColor: colors.border,
                                  boxShadow: shadows.input,
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checkout"
                      render={({ field }) => {
                        const checkinDate = form.watch("checkin")
                        // Calculate minimum checkout date (1 day after checkin)
                        const minCheckout = checkinDate 
                          ? new Date(new Date(checkinDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                          : new Date().toISOString().split('T')[0]
                        
                        return (
                          <FormItem>
                            <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Ngày trả phòng
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.primary }} />
                                <input
                                  type="date"
                                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                  style={{
                                    borderRadius: borderRadius.input,
                                    borderColor: colors.border,
                                    boxShadow: shadows.input,
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                  }}
                                  min={minCheckout}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>

                  {/* Khách section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Khách
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="adults"
                      render={({ field }) => {
                        const maxAdults = roomType?.maxAdults || 10
                        return (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <div>
                                <FormLabel className="text-base font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                  Người lớn
                                </FormLabel>
                                <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                  Từ 13 tuổi
                                </p>
                              </div>
                              <FormControl>
                                <div className="flex items-center gap-3">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => field.onChange(Math.max(1, field.value - 1))}
                                    disabled={field.value <= 1}
                                  >
                                    -
                                  </Button>
                                  <span className="text-lg font-semibold w-8 text-center" style={{ color: colors.textPrimary }}>
                                    {field.value}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    style={{ backgroundColor: colors.primary, color: 'white', border: 'none' }}
                                    onClick={() => {
                                      if (field.value >= maxAdults) {
                                        showToast.error(`Phòng chỉ chứa tối đa ${maxAdults} người lớn`)
                                        return
                                      }
                                      field.onChange(Math.min(maxAdults, field.value + 1))
                                    }}
                                    disabled={field.value >= maxAdults}
                                  >
                                    +
                                  </Button>
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="children"
                      render={({ field }) => {
                        const maxChildren = roomType?.maxChildren || 10
                        return (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <div>
                                <FormLabel className="text-base font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                  Trẻ em
                                </FormLabel>
                                <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                  Từ 0-12 tuổi
                                </p>
                              </div>
                              <FormControl>
                                <div className="flex items-center gap-3">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => field.onChange(Math.max(0, field.value - 1))}
                                    disabled={field.value <= 0}
                                  >
                                    -
                                  </Button>
                                  <span className="text-lg font-semibold w-8 text-center" style={{ color: colors.textPrimary }}>
                                    {field.value}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    style={{ backgroundColor: colors.primary, color: 'white', border: 'none' }}
                                    onClick={() => {
                                      if (field.value >= maxChildren) {
                                        showToast.error(`Phòng chỉ chứa tối đa ${maxChildren} trẻ em`)
                                        return
                                      }
                                      field.onChange(Math.min(maxChildren, field.value + 1))
                                    }}
                                    disabled={field.value >= maxChildren}
                                  >
                                    +
                                  </Button>
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                    
                    <div className="pt-2">
                      <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Tổng: {(form.watch('adults') || 0) + (form.watch('children') || 0)} khách
                      </p>
                      {roomType && (roomType.maxAdults || roomType.maxChildren) && (
                        <p className="text-xs mt-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Sức chứa tối đa: {roomType.maxAdults || 0} người lớn{roomType.maxChildren ? `, ${roomType.maxChildren} trẻ em` : ''}
                        </p>
                      )}
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
                    disabled={isLoading}
                    onClick={(e) => {
                      // Prevent default form submission, just save and navigate
                      e.preventDefault()
                      const formData = form.getValues()
                      if (form.formState.isValid) {
                        onSubmit(formData)
                      } else {
                        form.handleSubmit(onSubmit)()
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang chuyển...
                      </>
                    ) : (
                      <>
                        Tiếp tục đến bước tiếp theo
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Property Summary Sidebar */}
          {property && (
            <div>
              <div
                className="bg-white p-6 sticky top-24"
                style={{
                  borderRadius: borderRadius.card,
                  boxShadow: shadows.cardHover,
                }}
              >
                <div className="mb-6">
                  <img
                    src={getImageUrl(property.images)}
                    alt={property.name}
                    className="w-full h-48 object-cover mb-4"
                    style={{ borderRadius: borderRadius.image }}
                  />
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {property.name}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {getLocationText()}
                  </p>
                  {property.rating && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-lg w-fit" style={{ backgroundColor: colors.lightBlue }}>
                      <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                        ⭐ {property.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {roomType && (
                  <div className="pt-6 border-t mb-6" style={{ borderColor: colors.border }}>
                    <h4 className="font-semibold mb-3" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Thông tin loại phòng
                    </h4>
                    
                    <div className="space-y-3">
                      {/* Room Type Name */}
                      <div className="flex items-start gap-2">
                        <Bed className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {roomType.name}
                          </p>
                          {roomType.description && (
                            <p className="text-xs mt-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              {roomType.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Occupancy Info */}
                      {((roomType.maxAdults && roomType.maxAdults > 0) || (roomType.maxChildren && roomType.maxChildren > 0)) && (
                        <div className="flex items-start gap-2">
                          <Users className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                          <div className="text-sm" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {roomType.maxAdults && roomType.maxAdults > 0 && (
                              <span>{roomType.maxAdults} người lớn</span>
                            )}
                            {roomType.maxChildren && roomType.maxChildren > 0 && (
                              <span>
                                {roomType.maxAdults && roomType.maxAdults > 0 ? ', ' : ''}
                                {roomType.maxChildren} trẻ em
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bed Type */}
                      {roomType.bedType && (
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} />
                          <p className="text-sm" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {roomType.bedType}
                          </p>
                        </div>
                      )}

                      {/* Amenities */}
                      {(() => {
                        const amenityNames = getAmenityNames(roomType)
                        return amenityNames.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Tiện nghi:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {amenityNames.slice(0, 6).map((name, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 rounded-lg"
                                  style={{
                                    backgroundColor: colors.lightBlue,
                                    color: colors.textPrimary,
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                  }}
                                >
                                  {name}
                                </span>
                              ))}
                              {amenityNames.length > 6 && (
                                <span className="text-xs px-2 py-1" style={{ color: colors.textSecondary }}>
                                  +{amenityNames.length - 6} tiện nghi khác
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })()}

                      {/* Price */}
                      {roomType.basePrice && (
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              {typeof roomType.basePrice === 'number'
                                ? roomType.basePrice.toLocaleString('vi-VN')
                                : parseFloat(roomType.basePrice).toLocaleString('vi-VN')}đ
                            </p>
                            <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              /đêm
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                  <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Sau khi chọn ngày, bạn sẽ được chuyển đến trang thanh toán để hoàn tất đặt phòng.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
