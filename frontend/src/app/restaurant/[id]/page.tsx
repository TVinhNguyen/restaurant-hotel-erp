"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Utensils, MapPin, Phone, Mail, Loader2, CheckCircle, Users, Globe } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { restaurantsService, type Restaurant } from "@/lib/services/restaurants"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

export default function RestaurantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)
        
        // Fetch restaurant details
        const restaurantData = await restaurantsService.getRestaurantById(params.id as string)
        setRestaurant(restaurantData)
      } catch (err) {
        console.error("Failed to load restaurant:", err)
        setError(err instanceof Error ? err.message : "Không thể tải thông tin nhà hàng")
      } finally {
        setIsLoading(false)
      }
    }

    loadRestaurant()
  }, [params.id])

  const getImageUrl = (images?: string[], index: number = 0) => {
    if (images && images.length > index) {
      return images[index]
    }
    const fallbacks = [
      "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
      "/modern-hotel-room-with-city-view-london.jpg",
      "/modern-green-hotel-building-exterior.jpg",
      "/dark-modern-hotel-room-with-ambient-lighting.jpg",
    ]
    return fallbacks[index % fallbacks.length] || "/placeholder.svg"
  }

  if (isLoading) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }} className="mb-4">
            {error || "Không tìm thấy thông tin nhà hàng"}
          </p>
          <BackButton variant="ghost" text="Quay lại danh sách" onClick={() => router.push('/properties')} />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton variant="ghost" />
        </div>

        {/* Restaurant Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <img
              src={getImageUrl(restaurant.images, 0)}
              alt={restaurant.name}
              className="w-full h-80 object-cover"
              style={{ borderRadius: borderRadius.image }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <img
                key={index}
                src={getImageUrl(restaurant.images, index)}
                alt={`${restaurant.name} - ${index}`}
                className="w-full h-38 object-cover"
                style={{ borderRadius: borderRadius.image }}
              />
            ))}
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {restaurant.name}
            </h2>
            {restaurant.rating && (
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(restaurant.rating!) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {restaurant.description || restaurant.cuisineType || restaurant.cuisine}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-4 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {restaurant.openingHours && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {restaurant.openingHours}
                </span>
              )}
              {(restaurant.cuisineType || restaurant.cuisine) && (
                <span className="flex items-center">
                  <Utensils className="h-3 w-3 mr-1" />
                  {restaurant.cuisineType || restaurant.cuisine}
                </span>
              )}
            </div>
          </div>
          {restaurant.rating && (
            <div className="text-right">
              <Badge className="text-lg px-3 py-1" style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}>
                {restaurant.rating.toFixed(1)}★
              </Badge>
            </div>
          )}
        </div>

        {/* Restaurant Description */}
        {restaurant.description && (
          <div className="mb-8">
            <Card className="bg-white" style={{ borderRadius: borderRadius.card, boxShadow: shadows.card, border: `1px solid ${colors.border}` }}>
              <CardContent className="p-6 bg-white">
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Về nhà hàng
                </h3>
                <p className="text-base leading-relaxed" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {restaurant.description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tables Info */}
        {restaurant.tables && restaurant.tables.length > 0 && (
          <div className="mb-8">
            <Card className="bg-white" style={{ borderRadius: borderRadius.card, boxShadow: shadows.card, border: `1px solid ${colors.border}` }}>
              <CardContent className="p-6 bg-white">
                <h3 className="text-xl font-bold mb-6" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Thông tin bàn
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div 
                    className="text-center p-6 border-2 transition-all hover:shadow-md"
                    style={{ 
                      borderRadius: borderRadius.card,
                      borderColor: colors.border,
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: colors.lightBlue }}
                    >
                      <Utensils className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                    <p className="text-2xl font-bold mb-1" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {restaurant.tables.length}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Tổng số bàn
                    </p>
                  </div>
                  <div 
                    className="text-center p-6 border-2 transition-all hover:shadow-md"
                    style={{ 
                      borderRadius: borderRadius.card,
                      borderColor: colors.border,
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: '#10B98120' }}
                    >
                      <CheckCircle className="w-6 h-6" style={{ color: '#10B981' }} />
                    </div>
                    <p className="text-2xl font-bold mb-1" style={{ color: '#10B981', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {restaurant.tables.filter(t => t.status === 'available').length}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Bàn trống
                    </p>
                  </div>
                  <div 
                    className="text-center p-6 border-2 transition-all hover:shadow-md"
                    style={{ 
                      borderRadius: borderRadius.card,
                      borderColor: colors.border,
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: colors.lightBlue }}
                    >
                      <Users className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                    <p className="text-2xl font-bold mb-1" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {Math.max(...restaurant.tables.map(t => t.capacity))}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Sức chứa max
                    </p>
                  </div>
                  <div 
                    className="text-center p-6 border-2 transition-all hover:shadow-md"
                    style={{ 
                      borderRadius: borderRadius.card,
                      borderColor: colors.border,
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: colors.lightBlue }}
                    >
                      <Users className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                    <p className="text-2xl font-bold mb-1" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {Math.min(...restaurant.tables.map(t => t.capacity))}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Sức chứa min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reserve Table CTA */}
        <div className="mb-8">
          <Card 
            className="bg-white border-2"
            style={{ 
              borderRadius: borderRadius.card, 
              boxShadow: shadows.card,
              borderColor: colors.primary
            }}
          >
            <CardContent className="p-8 bg-white">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Sẵn sàng dùng bữa cùng chúng tôi?
                  </h3>
                  <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Đặt bàn ngay để có trải nghiệm ẩm thực khó quên
                  </p>
                </div>
                <Link href={`/restaurant/booking?id=${restaurant.id}`}>
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-white font-semibold transition-all hover:shadow-lg"
                    style={{ 
                      backgroundColor: colors.primary, 
                      borderRadius: borderRadius.button,
                      fontFamily: 'system-ui, -apple-system, sans-serif' 
                    }}
                  >
                    Đặt bàn ngay
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        {restaurant.property && (
          <div className="mb-8">
            <Card className="bg-white" style={{ borderRadius: borderRadius.card, boxShadow: shadows.card, border: `1px solid ${colors.border}` }}>
              <CardContent className="p-6 bg-white">
                <h3 className="text-xl font-bold mb-6" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Thông tin liên hệ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location & Address */}
                  {(restaurant.location || restaurant.property.address) && (
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.lightBlue }}
                      >
                        <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Địa chỉ
                        </p>
                        <div className="text-sm space-y-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {restaurant.location && (
                            <p className="font-medium">{restaurant.location}</p>
                          )}
                          {restaurant.property.address && (
                            <p>{restaurant.property.address}</p>
                          )}
                          {(restaurant.property.city || restaurant.property.country) && (
                            <p>
                              {[restaurant.property.city, restaurant.property.country].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Phone */}
                  {restaurant.property.phone && (
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.lightBlue }}
                      >
                        <Phone className="w-5 h-5" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Điện thoại
                        </p>
                        <a 
                          href={`tel:${restaurant.property.phone}`}
                          className="text-sm hover:underline"
                          style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          {restaurant.property.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Email */}
                  {restaurant.property.email && (
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.lightBlue }}
                      >
                        <Mail className="w-5 h-5" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Email
                        </p>
                        <a 
                          href={`mailto:${restaurant.property.email}`}
                          className="text-sm hover:underline break-all"
                          style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          {restaurant.property.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Website */}
                  {restaurant.property.website && (
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.lightBlue }}
                      >
                        <Globe className="w-5 h-5" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Website
                        </p>
                        <a 
                          href={restaurant.property.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline break-all"
                          style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          {restaurant.property.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
