"use client"

import { useState, useEffect, useRef } from "react"
import { Award, Shield, TrendingUp } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import SearchHero from "@/components/SearchHero"
import HotelCard from "@/components/HotelCard"
import PropertiesListSkeleton from "@/components/skeletons/PropertiesListSkeleton"
import { colors } from "@/lib/designTokens"
import { propertiesService, type Property } from "@/lib/services/properties"

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Load featured properties
    const loadFeatured = async () => {
      try {
        const response = await propertiesService.getProperties({ page: 1, limit: 6 })
        const properties = response.data || []
        
        // Enrich properties with additional data
        const enrichedProperties = await Promise.all(
          properties.map(async (property) => {
            try {
              // Get room types to extract the LOWEST base price
              const roomTypes = await propertiesService.getRoomTypes(property.id)
              let minPrice = null
              
              if (roomTypes.length > 0) {
                // Find the minimum price from all room types
                const prices = roomTypes
                  .map(rt => typeof rt.basePrice === 'string' ? parseFloat(rt.basePrice) : rt.basePrice)
                  .filter(price => price != null && price > 0)
                
                if (prices.length > 0) {
                  minPrice = Math.min(...prices)
                }
              }
              
              const allImages: string[] = []
              
              if (property.images && property.images.length > 0) {
                allImages.push(...property.images)
              }
              
              if (roomTypes && roomTypes.length > 0) {
                roomTypes.forEach(roomType => {
                  if (roomType.photos && roomType.photos.length > 0) {
                    const roomPhotos = roomType.photos.map((photo: { url: string }) => photo.url)
                    allImages.push(...roomPhotos)
                  } 
                  else if (roomType.images && roomType.images.length > 0) {
                    allImages.push(...roomType.images)
                  }
                })
              }
              
              return {
                ...property,
                basePrice: minPrice ?? undefined,
                description: property.description || `Khám phá ${property.name} - một trong những ${property.propertyType || 'khách sạn'} hàng đầu tại ${property.city || 'Việt Nam'}`,
                amenities: property.amenities || ['WiFi', 'Parking', 'Minibar'],
                images: allImages.length > 0 ? allImages : property.images,
              }
            } catch (err) {
              // If failed to get room types, return property as is with fallback data
              return {
                ...property,
                description: property.description || `Khám phá ${property.name} - một trong những ${property.propertyType || 'khách sạn'} hàng đầu tại ${property.city || 'Việt Nam'}`,
                amenities: property.amenities || ['WiFi', 'Parking', 'Minibar'],
                images: property.images || [],
              }
            }
          })
        )
        
        setFeaturedProperties(enrichedProperties)
      } catch (err) {
        console.error("Failed to load featured properties:", err)
      }
    }
    loadFeatured()
  }, [])

  useEffect(() => {
    // Scroll reveal animation - run after properties are loaded
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          entry.target.classList.remove("opacity-0", "translate-y-10")
        }
      })
    }, observerOptions)

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      // Observe all elements with scroll-reveal class
      const scrollRevealElements = document.querySelectorAll('.scroll-reveal')
      scrollRevealElements.forEach((element) => {
        element.classList.add("transition-all", "duration-700", "ease-out")
        observer.observe(element)
      })

      // Also observe refs
      sectionsRef.current.forEach((section) => {
        if (section) {
          section.classList.add("transition-all", "duration-700", "ease-out")
          observer.observe(section)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [featuredProperties])


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 gradient-bg" />
      
      <div className="relative z-10">
        <Header />
        <SearchHero />

      {/* Features Section */}
      <div
        ref={(el) => {
          sectionsRef.current[0] = el
        }}
        className="max-w-7xl mx-auto px-6 py-16 scroll-reveal opacity-0 translate-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div
            className="group bg-white p-8 rounded-3xl text-center scroll-reveal opacity-0 translate-y-10 relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer"
            style={{ 
              boxShadow: "0 4px 24px rgba(30, 64, 175, 0.08)",
              animationDelay: "0.1s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(30, 64, 175, 0.15)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(30, 64, 175, 0.08)"
            }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:via-blue-50/30 group-hover:to-blue-50/50 transition-all duration-500 rounded-3xl" />
            
            <div className="relative z-10">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg"
                style={{ 
                  backgroundColor: colors.lightBlue,
                  boxShadow: "0 4px 16px rgba(30, 64, 175, 0.1)"
                }}
              >
                <Award className="w-10 h-10 transition-all duration-500 group-hover:scale-110" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-blue-600" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Đặt phòng dễ dàng
              </h3>
              <p className="text-sm leading-relaxed transition-colors duration-300" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Tìm và đặt phòng nhanh chóng
              </p>
            </div>
          </div>

          <div
            className="group bg-white p-8 rounded-3xl text-center scroll-reveal opacity-0 translate-y-10 relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer"
            style={{ 
              boxShadow: "0 4px 24px rgba(30, 64, 175, 0.08)",
              animationDelay: "0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(30, 64, 175, 0.15)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(39, 73, 125, 0.08)"
            }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 via-green-50/0 to-green-50/0 group-hover:from-green-50/50 group-hover:via-green-50/30 group-hover:to-green-50/50 transition-all duration-500 rounded-3xl" />
            
            <div className="relative z-10">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg"
                style={{ 
                  backgroundColor: colors.lightBlue,
                  boxShadow: "0 4px 16px rgba(30, 64, 175, 0.1)"
                }}
              >
                <Shield className="w-10 h-10 transition-all duration-500 group-hover:scale-110" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-green-600" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Nhà hàng cao cấp
              </h3>
              <p className="text-sm leading-relaxed transition-colors duration-300" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Trải nghiệm ẩm thực đỉnh cao
              </p>
            </div>
        </div>

          <div
            className="group bg-white p-8 rounded-3xl text-center scroll-reveal opacity-0 translate-y-10 relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer"
            style={{ 
              boxShadow: "0 4px 24px rgba(30, 64, 175, 0.08)",
              animationDelay: "0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(30, 64, 175, 0.15)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(39, 73, 125, 0.08)"
            }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 via-orange-50/0 to-orange-50/0 group-hover:from-orange-50/50 group-hover:via-orange-50/30 group-hover:to-orange-50/50 transition-all duration-500 rounded-3xl" />
            
            <div className="relative z-10">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg"
                style={{ 
                  backgroundColor: colors.lightBlue,
                  boxShadow: "0 4px 16px rgba(30, 64, 175, 0.1)"
                }}
        >
                <TrendingUp className="w-10 h-10 transition-all duration-500 group-hover:scale-110" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-orange-600" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Thanh toán an toàn
              </h3>
              <p className="text-sm leading-relaxed transition-colors duration-300" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Thanh toán bằng mã QR nhanh chóng và an toàn
              </p>
            </div>
          </div>
        </div>

        {/* Featured Properties */}
        <div className="mb-12 scroll-reveal opacity-0 translate-y-10">
          <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Các cơ sở của chúng tôi
          </h2>
          <p className="text-lg" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Lướt các dịch vụ bạn yêu thích với mức giá đặc biệt
          </p>
        </div>

        {featuredProperties.length === 0 ? (
          <PropertiesListSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {featuredProperties.slice(0, 6).map((property, index) => (
              <div
                key={property.id}
                className="scroll-reveal opacity-0 translate-y-10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <HotelCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>

        <Footer />
      </div>
    </div>
  )
}
