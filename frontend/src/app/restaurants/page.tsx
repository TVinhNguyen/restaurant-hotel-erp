"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Utensils, MapPin, Loader2, Search } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { restaurantsService, type Restaurant } from "@/lib/services/restaurants"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

export default function RestaurantsPage() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setIsLoading(true)
        const response = await restaurantsService.getRestaurants({
          page: 1,
          limit: 100,
        })

        // Handle different response formats
        if ('restaurants' in response && Array.isArray(response.restaurants)) {
          setRestaurants(response.restaurants)
        } else if ('data' in response && Array.isArray(response.data)) {
          setRestaurants(response.data)
        } else if (Array.isArray(response)) {
          setRestaurants(response)
        }
      } catch (error) {
        console.error("Failed to load restaurants:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRestaurants()
  }, [])

  const getImageUrl = (images?: string[]) => {
    if (images && images.length > 0) {
      return images[0]
    }
    const fallbacks = [
      "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
      "/modern-hotel-room-with-city-view-london.jpg",
      "/modern-green-hotel-building-exterior.jpg",
      "/dark-modern-hotel-room-with-ambient-lighting.jpg",
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)] || "/placeholder.svg"
  }

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Nhà hàng
          </h1>
          <p className="text-lg mb-8" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Khám phá các nhà hàng tuyệt vời tại khách sạn của chúng tôi
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: colors.textSecondary }} />
              <input
                type="text"
                placeholder="Tìm kiếm nhà hàng theo tên, mô tả, loại món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.border,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  borderRadius: borderRadius.input,
                }}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {searchTerm ? "Không tìm thấy nhà hàng phù hợp" : "Chưa có nhà hàng nào"}
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Tìm thấy <span className="font-semibold" style={{ color: colors.textPrimary }}>{filteredRestaurants.length}</span> nhà hàng
              </p>
            </div>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                  style={{ 
                    borderRadius: borderRadius.card,
                    boxShadow: shadows.card,
                    border: `1px solid ${colors.border}`
                  }}
                  onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                >
                  {/* Restaurant Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getImageUrl(restaurant.images)}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      style={{ borderRadius: `${borderRadius.card} ${borderRadius.card} 0 0` }}
                    />
                    {restaurant.rating && (
                      <div className="absolute top-3 right-3">
                        <Badge className="font-semibold flex items-center gap-1" style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}>
                          <Star className="w-3 h-3 fill-current" />
                          {restaurant.rating.toFixed(1)}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 bg-white">
                    <div className="space-y-3">
                      {/* Restaurant Name */}
                      <h3 className="text-xl font-bold transition-colors" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {restaurant.name}
                      </h3>

                      {/* Description */}
                      {restaurant.description && (
                        <p className="text-sm line-clamp-2" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {restaurant.description}
                        </p>
                      )}

                      {/* Info Grid */}
                      <div className="space-y-2">
                        {/* Cuisine Type */}
                        {restaurant.cuisineType && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: colors.lightBlue }}
                            >
                              <Utensils className="w-4 h-4" style={{ color: colors.primary }} />
                            </div>
                            <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              {restaurant.cuisineType}
                            </span>
                          </div>
                        )}

                        {/* Opening Hours */}
                        {restaurant.openingHours && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: colors.lightBlue }}
                            >
                              <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                            </div>
                            <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              {restaurant.openingHours}
                            </span>
                          </div>
                        )}

                        {/* Location */}
                        {restaurant.location && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: colors.lightBlue }}
                            >
                              <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
                            </div>
                            <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              {restaurant.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Property Info */}
                      {restaurant.property && (
                        <div className="pt-3 border-t" style={{ borderColor: colors.border }}>
                          <p className="text-xs font-medium" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Tại {restaurant.property.name}
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-2">
                        <Button
                          className="w-full font-semibold"
                          style={{ 
                            backgroundColor: colors.primary,
                            borderRadius: borderRadius.button,
                            fontFamily: 'system-ui, -apple-system, sans-serif' 
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/restaurant/${restaurant.id}`)
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

