"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { colors, shadows, borderRadius } from "@/lib/designTokens"
import { useRouter } from "next/navigation"

const heroImages = [
  "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=1920",
]

export default function SearchHero() {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 3000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleSearch = () => {
    router.push("/properties")
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Carousel Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group cursor-pointer"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group cursor-pointer"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentImageIndex
                ? "w-8 bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center z-20">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Khám Phá Kỳ Nghỉ Trong Mơ
          </h1>
          <p className="text-xl text-white/90 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Hơn 1,000+ khách sạn & resort cao cấp trên toàn quốc
          </p>
        </div>

        <div
          className="bg-white p-8 mx-auto w-full max-w-5xl"
          style={{
            borderRadius: borderRadius.card,
            boxShadow: shadows.cardHover,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Điểm đến
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.primary }}
                />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Phú Quốc, Đà Nẵng..."
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderRadius: borderRadius.input,
                    borderColor: colors.border,
                    boxShadow: shadows.input,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Ngày nhận phòng
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.primary }}
                />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderRadius: borderRadius.input,
                    borderColor: colors.border,
                    boxShadow: shadows.input,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Ngày trả phòng
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.primary }}
                />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderRadius: borderRadius.input,
                    borderColor: colors.border,
                    boxShadow: shadows.input,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Khách & Phòng
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.primary }} />
                <select
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none"
                  style={{
                    borderRadius: borderRadius.input,
                    borderColor: colors.border,
                    boxShadow: shadows.input,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  <option>2 Khách, 1 Phòng</option>
                  <option>3 Khách, 1 Phòng</option>
                  <option>4 Khách, 2 Phòng</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full mt-6 py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 button-hover relative cursor-pointer"
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.button,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Tìm kiếm
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
