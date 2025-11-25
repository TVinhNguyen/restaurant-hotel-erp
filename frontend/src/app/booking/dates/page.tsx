"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, Calendar, Users, Bed, ArrowRight, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { colors, shadows, borderRadius } from "@/lib/designTokens"
import { propertiesService, type Property } from "@/lib/services/properties"
import { showToast } from "@/lib/toast"

const bookingDatesSchema = z.object({
  checkin: z.string().min(1, "Vui lòng chọn ngày nhận phòng"),
  checkout: z.string().min(1, "Vui lòng chọn ngày trả phòng"),
  guests: z.number().min(1, "Ít nhất 1 khách").max(10, "Tối đa 10 khách"),
  rooms: z.number().min(1, "Ít nhất 1 phòng").max(5, "Tối đa 5 phòng"),
})

type BookingDatesFormValues = z.infer<typeof bookingDatesSchema>

export default function BookingDatesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProperty, setLoadingProperty] = useState(true)
  const [property, setProperty] = useState<Property | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProperty = async () => {
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
        }
      } catch (err) {
        console.error("Failed to load property:", err)
      } finally {
        setLoadingProperty(false)
      }
    }

    loadProperty()
  }, [router])

  const form = useForm<BookingDatesFormValues>({
    resolver: zodResolver(bookingDatesSchema),
    defaultValues: {
      checkin: "",
      checkout: "",
      guests: 2,
      rooms: 1,
    },
  })

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
        <div className="flex items-center space-x-4 mb-6">
          <Link href={property ? `/property/${property.id}` : "/properties"}>
            <Button variant="ghost" size="sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
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
                      render={({ field }) => (
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
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="guests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Số khách
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.primary }} />
                              <input
                                type="number"
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                style={{
                                  borderRadius: borderRadius.input,
                                  borderColor: colors.border,
                                  boxShadow: shadows.input,
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                }}
                                min="1"
                                max="10"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Số phòng
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Bed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.primary }} />
                              <input
                                type="number"
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                                style={{
                                  borderRadius: borderRadius.input,
                                  borderColor: colors.border,
                                  boxShadow: shadows.input,
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                }}
                                min="1"
                                max="5"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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

                <div className="pt-6 border-t" style={{ borderColor: colors.border }}>
                  <p className="text-sm mb-4" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Sau khi chọn ngày, bạn sẽ được chuyển đến trang thanh toán để hoàn tất đặt phòng.
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }} />
                    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Hủy miễn phí trước 24h</span>
                  </div>
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
