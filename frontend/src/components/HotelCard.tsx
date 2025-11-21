"use client"

import { useState, useEffect, useRef } from 'react'
import { Star, MapPin, Wifi, Coffee, Waves } from 'lucide-react'
import { colors, shadows, borderRadius } from '@/lib/designTokens'
import Link from 'next/link'
import type { Property } from '@/lib/services/properties'

interface HotelCardProps {
  property: Property
}

export default function HotelCard({ property }: HotelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fallbacks = [
    "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
    "/modern-hotel-room-with-city-view-london.jpg",
    "/modern-green-hotel-building-exterior.jpg",
    "/dark-modern-hotel-room-with-ambient-lighting.jpg",
    "/luxury-hotel-suite-with-marble-bathroom.jpg",
  ]

  // Get all available images (from property.images or fallbacks)
  const getAllImages = () => {
    if (property.images && property.images.length > 0) {
      return property.images
    }
    // Use property ID to consistently select fallback images
    const startIndex = property.id ? parseInt(property.id.replace(/-/g, '').slice(0, 8), 16) % fallbacks.length : 0
    // Return 3-4 fallback images in a cycle
    return [
      fallbacks[startIndex % fallbacks.length],
      fallbacks[(startIndex + 1) % fallbacks.length],
      fallbacks[(startIndex + 2) % fallbacks.length],
    ]
  }

  const images = getAllImages()
  const hasMultipleImages = images.length > 1

  // Auto-rotate images on hover
  useEffect(() => {
    if (isHovered && hasMultipleImages) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 1500) // Change image every 1.5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, hasMultipleImages, images.length])

  // Reset to first image when hover ends
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0)
    }
  }, [isHovered])

  const getImageUrl = (index: number = 0) => {
    return images[index] || "/placeholder.svg"
  }

  const getLocationText = () => {
    if (property.city && property.country) {
      return `${property.city}, ${property.country}`
    }
    if (property.address) {
      return property.address
    }
    return "Chưa có địa chỉ"
  }

  const amenities = property.amenities || []
  const displayedAmenities = amenities.slice(0, 3)

  return (
    <Link href={`/property/${property.id}`}>
      <div
        className="bg-white overflow-hidden cursor-pointer group card-hover"
        style={{
          borderRadius: borderRadius.card,
          boxShadow: shadows.card
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Image container with carousel */}
          <div className="relative w-full h-full">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.name} - Image ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
                } ${isHovered ? 'group-hover:scale-110' : ''}`}
                style={{
                  transition: 'opacity 0.5s ease-in-out, transform 0.7s ease-out'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            ))}
          </div>

          {/* Navigation dots */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentImageIndex
                      ? 'w-6 bg-white'
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
          <button className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 z-20 shadow-lg cursor-pointer">
            <Star className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
          {property.propertyType && (
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg z-20">
              <span className="text-xs font-semibold" style={{ color: colors.primary }}>
                {property.propertyType}
              </span>
            </div>
          )}
          {property.rating && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-lg z-20">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm" style={{ color: colors.textPrimary }}>
                {property.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {property.name}
              </h3>
              <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{getLocationText()}</span>
              </div>
            </div>
          </div>

          {property.description && (
            <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {property.description}
            </p>
          )}

          {displayedAmenities.length > 0 && (
            <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: colors.border }}>
              {displayedAmenities.map((amenity, index) => {
                const amenityIcons: Record<string, typeof Wifi> = {
                  'WiFi': Wifi,
                  'Wifi': Wifi,
                  'Parking': Coffee,
                  'Minibar': Coffee,
                  'Ocean View': Waves,
                  'Sea View': Waves,
                }
                const Icon = amenityIcons[amenity] || Wifi
                
                return (
                  <div key={index} className="p-2 rounded-full" style={{ backgroundColor: colors.lightBlue }}>
                    <Icon className="w-4 h-4" style={{ color: colors.primary }} />
                  </div>
                )
              })}
              {amenities.length > 3 && (
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  +{amenities.length - 3} tiện ích
                </span>
              )}
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                Từ
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Liên hệ
              </p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                /đêm
              </p>
            </div>
            <button
              className="px-6 py-2 text-white font-medium rounded-xl button-hover relative cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.button
              }}
            >
              <span className="relative z-10">Đặt ngay</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

