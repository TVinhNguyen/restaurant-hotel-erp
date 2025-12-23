"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, Clock, Utensils, Star, Loader2, MapPin } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { restaurantsService, type Restaurant } from "@/lib/services/restaurants"
import { authService } from "@/lib/auth"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

const restaurantBookingSchema = z.object({
  date: z.string().min(1, "Vui lòng chọn ngày đặt bàn"),
  time: z.string().min(1, "Vui lòng chọn thời gian"),
  guests: z.number().min(1, "Cần ít nhất 1 khách").max(12, "Tối đa 12 khách mỗi bàn"),
})

type RestaurantBookingFormValues = z.infer<typeof restaurantBookingSchema>

export default function RestaurantBookingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true)
  const [error, setError] = useState("")
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get('id') || ''

  // Get saved form data
  const savedForm = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem("restaurant_booking_form") || "null")
    : null

  const form = useForm<RestaurantBookingFormValues>({
    resolver: zodResolver(restaurantBookingSchema),
    defaultValues: {
      date: savedForm?.date || "",
      time: savedForm?.time || "",
      guests: savedForm?.guests || 2,
    },
  })

  // Check authentication and fetch restaurant data
  useEffect(() => {
    const loadRestaurant = async () => {
      // ✅ Check if user is logged in
      if (!authService.isAuthenticated()) {
        // Save current URL to return after login
        const currentUrl = window.location.href
        localStorage.setItem('redirectAfterLogin', currentUrl)
        router.push('/login')
        return
      }

      if (!restaurantId) {
        setError("Restaurant ID is required")
        setIsLoadingRestaurant(false)
        return
      }

      try {
        setIsLoadingRestaurant(true)
        const data = await restaurantsService.getRestaurantById(restaurantId)
        setRestaurant(data)
      } catch (err) {
        console.error("Failed to load restaurant:", err)
        setError("Failed to load restaurant details")
      } finally {
        setIsLoadingRestaurant(false)
      }
    }

    loadRestaurant()
  }, [restaurantId, router])

  // ✅ Auto-save form data when user types
  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (formData) {
        localStorage.setItem("restaurant_booking_form", JSON.stringify(formData))
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Generate time slots from restaurant opening hours
  const generateTimeSlots = (openingHours: string | undefined): string[] => {
    if (!openingHours) return []
    
    try {
      // Parse "06:00 - 23:00" or "17:00 - 02:00" format
      const [startTime, endTime] = openingHours.split('-').map(t => t.trim())
      
      const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number)
        return hours * 60 + minutes // Convert to minutes
      }
      
      const formatTime = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60) % 24 // Handle overflow past midnight
        const minutes = totalMinutes % 60
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      }
      
      let startMinutes = parseTime(startTime)
      let endMinutes = parseTime(endTime)
      const slots: string[] = []
      
      // If end time is less than start time, restaurant is open past midnight
      // Add 24 hours (1440 minutes) to end time for calculation
      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60
      }
      
      // Generate slots every 30 minutes
      for (let time = startMinutes; time <= endMinutes - 30; time += 30) {
        slots.push(formatTime(time))
      }
      
      return slots
    } catch (error) {
      console.error('Error parsing opening hours:', error)
      return []
    }
  }

  const timeSlots = generateTimeSlots(restaurant?.openingHours)

  const onSubmit = async (data: RestaurantBookingFormValues) => {
    if (!restaurantId || !restaurant) {
      setError("Restaurant information is missing")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      // Auto-select suitable table based on guest count
      const availableTables = restaurant?.tables?.filter(
        table => table.status === 'available' && table.capacity >= data.guests
      ) || []

      if (availableTables.length === 0) {
        setError("Không có bàn phù hợp. Vui lòng chọn số khách khác hoặc thời gian khác.")
        setIsLoading(false)
        return
      }

      // Select the table with smallest capacity that fits (optimal selection)
      const selectedTable = availableTables.sort((a, b) => a.capacity - b.capacity)[0]
      
      const bookingData = {
        ...data,
        tableId: selectedTable.id,
        restaurantId,
        restaurantName: restaurant?.name || '',
        tableNumber: selectedTable.tableNumber,
        tableCapacity: selectedTable.capacity,
      }
      localStorage.setItem("restaurant_booking", JSON.stringify(bookingData))
      router.push(`/restaurant/confirmation?id=${restaurantId}`)
    } catch {
      setError("Failed to make reservation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton variant="ghost" />
        </div>

        <h2 className="text-2xl font-bold mb-8" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Đặt bàn nhà hàng
        </h2>

        {isLoadingRestaurant ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
          </div>
        ) : !restaurant ? (
          <div className="text-center py-12">
            <p className="text-lg mb-4" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {error || "Không tìm thấy nhà hàng"}
            </p>
            <Link href="/restaurants">
              <Button style={{ backgroundColor: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Xem danh sách nhà hàng
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white" style={{ borderRadius: borderRadius.card, boxShadow: shadows.card, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <Utensils className="h-5 w-5" />
                    <span>Đặt bàn</span>
                  </CardTitle>
                  <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Đặt bàn tại {restaurant.name}
                  </p>
                </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Ngày đặt bàn</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="date"
                                  className="pl-10"
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
                        name="guests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Số khách</FormLabel>
                            <FormControl>
                                  <div className="relative">
                                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  className="pl-10"
                                  min="1"
                                  max="12"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Thời gian</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                              {timeSlots.map((time) => (
                                <Button
                                  key={time}
                                  type="button"
                                  size="sm"
                                  onClick={() => field.onChange(time)}
                                  className="text-xs transition-all"
                                  style={{
                                    backgroundColor: field.value === time ? colors.primary : '#FFFFFF',
                                    color: field.value === time ? '#FFFFFF' : colors.textPrimary,
                                    border: `1px solid ${field.value === time ? colors.primary : colors.border}`,
                                    borderRadius: borderRadius.button,
                                    fontFamily: 'system-ui, -apple-system, sans-serif'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (field.value !== time) {
                                      e.currentTarget.style.backgroundColor = colors.lightBlue
                                      e.currentTarget.style.borderColor = colors.primary
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (field.value !== time) {
                                      e.currentTarget.style.backgroundColor = '#FFFFFF'
                                      e.currentTarget.style.borderColor = colors.border
                                    }
                                  }}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <div className="text-sm text-destructive text-center">
                        {error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                      style={{ 
                        backgroundColor: colors.primary, 
                        borderRadius: borderRadius.button,
                        fontFamily: 'system-ui, -apple-system, sans-serif' 
                      }}
                    >
                      {isLoading ? "Đang đặt bàn..." : "Đặt bàn ngay"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

            <div className="lg:col-span-1">
              <Card 
                className="sticky top-6 bg-white" 
                style={{ 
                  borderRadius: borderRadius.card, 
                  boxShadow: shadows.card,
                  border: `1px solid ${colors.border}` 
                }}
              >
                <CardContent className="p-6 bg-white">
                  <div className="space-y-4">
                    {/* Restaurant Image */}
                    <div className="relative">
                      <img
                        src={restaurant.images?.[0] || "/modern-hotel-room-with-city-view-london.jpg"}
                        alt={restaurant.name}
                        className="w-full h-48 object-cover"
                        style={{ borderRadius: borderRadius.image }}
                      />
                    </div>

                    {/* Restaurant Name & Rating */}
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {restaurant.name}
                      </h3>
                      {restaurant.rating && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex" style={{ color: '#FFD700' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                          <Badge style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}>
                            {restaurant.rating.toFixed(1)}
                          </Badge>
                        </div>
                      )}
                      {restaurant.description && (
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {restaurant.description}
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Restaurant Info */}
                    <div className="space-y-3">
                      {restaurant.openingHours && (
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colors.lightBlue }}
                          >
                            <Clock className="h-4 w-4" style={{ color: colors.primary }} />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Giờ mở cửa
                            </p>
                            <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              {restaurant.openingHours}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {restaurant.cuisineType && (
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colors.lightBlue }}
                          >
                            <Utensils className="h-4 w-4" style={{ color: colors.primary }} />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Loại món ăn
                            </p>
                            <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              {restaurant.cuisineType}
                            </p>
                          </div>
                        </div>
                      )}

                      {restaurant.location && (
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colors.lightBlue }}
                          >
                            <MapPin className="h-4 w-4" style={{ color: colors.primary }} />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Vị trí
                            </p>
                            <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              {restaurant.location}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Table Info */}
                    {restaurant.tables && restaurant.tables.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Thông tin bàn
                        </h4>
                        <ul className="text-xs space-y-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          <li>• Tổng số bàn: {restaurant.tables.length}</li>
                          <li>• Bàn trống: {restaurant.tables.filter(t => t.status === 'available').length}</li>
                          <li>
                            • Sức chứa: {Math.min(...restaurant.tables.map(t => t.capacity))} - {Math.max(...restaurant.tables.map(t => t.capacity))} khách
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

