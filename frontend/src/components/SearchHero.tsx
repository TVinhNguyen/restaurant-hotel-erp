"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Calendar, Users, ChevronLeft, ChevronRight, X, Plus, Minus } from "lucide-react"
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

const popularCities = [
  "Đà Nẵng",
  "Hồ Chí Minh",
  "Hà Nội",
  "Nha Trang",
  "Phú Quốc",
  "Hội An",
]

export interface SearchParams {
  location: string
  checkIn?: string
  checkOut?: string
  adults: number
  children: number
}

export default function SearchHero() {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState({ adults: 2, children: 0 })
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 3000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Auto-set checkout date when checkin changes
  useEffect(() => {
    if (checkIn && (!checkOut || checkOut <= checkIn)) {
      const nextDay = new Date(checkIn)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOut(nextDay.toISOString().split('T')[0])
    }
  }, [checkIn])

  const handleSearch = () => {
    // Validation: location and guests are required
    if (!destination.trim() || (guests.adults + guests.children) === 0) {
      alert("Vui lòng nhập điểm đến và số khách")
      return
    }

    const searchParams: SearchParams = {
      location: destination.trim(),
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      adults: guests.adults,
      children: guests.children,
    }

    // Save to localStorage for properties page to use
    localStorage.setItem("search_params", JSON.stringify(searchParams))
    router.push("/properties")
  }

  const canSearch = destination.trim() !== "" && (guests.adults + guests.children) > 0

  const getNights = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getGuestsText = () => {
    const total = guests.adults + guests.children
    if (total === 0) return "Chọn số khách"
    const parts: string[] = []
    if (guests.adults > 0) parts.push(`${guests.adults} người lớn`)
    if (guests.children > 0) parts.push(`${guests.children} trẻ em`)
    return parts.join(", ")
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
                Điểm đến <span className="text-red-500">*</span>
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
                  onFocus={() => setShowCityPicker(true)}
                  placeholder="Thành phố, tên khách sạn..."
                  className="w-full pl-12 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderRadius: borderRadius.input,
                    borderColor: colors.border,
                    boxShadow: shadows.input,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                />
                {destination && (
                  <button
                    onClick={() => setDestination("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                )}
              </div>
              
              {/* Quick City Select */}
              {showCityPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl p-4 z-50" style={{ boxShadow: shadows.cardHover }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      Điểm đến phổ biến
                    </p>
                    <button onClick={() => setShowCityPicker(false)}>
                      <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {popularCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setDestination(city)
                          setShowCityPicker(false)
                        }}
                        className="text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Nhận phòng <span className="text-xs" style={{ color: colors.textSecondary }}>(Tùy chọn)</span>
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
                  min={new Date().toISOString().split('T')[0]}
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
                Trả phòng <span className="text-xs" style={{ color: colors.textSecondary }}>(Tùy chọn)</span>
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
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderRadius: borderRadius.input,
                    borderColor: colors.border,
                    boxShadow: shadows.input,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                />
              </div>
              {checkIn && checkOut && getNights() > 0 && (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: colors.primary }}>
                  {getNights()} đêm
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Số khách <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.primary }} />
                <button
                  type="button"
                  onClick={() => setShowGuestPicker(!showGuestPicker)}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-left"
                  style={{
                    borderRadius: borderRadius.input,
                    borderColor: colors.border,
                    boxShadow: shadows.input,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: (guests.adults + guests.children) === 0 ? colors.textSecondary : colors.textPrimary,
                  }}
                >
                  {getGuestsText()}
                </button>
              </div>
              
              {/* Guest Picker Modal */}
              {showGuestPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl p-4 z-50" style={{ boxShadow: shadows.cardHover }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      Số lượng khách
                    </p>
                    <button onClick={() => setShowGuestPicker(false)}>
                      <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    </button>
                  </div>
                  
                  {/* Adults */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: colors.border }}>
                    <div>
                      <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Người lớn
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Từ 13 tuổi trở lên
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(0, prev.adults - 1) }))}
                        disabled={guests.adults === 0}
                        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30"
                        style={{ borderColor: colors.border, color: colors.primary }}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium" style={{ color: colors.textPrimary }}>
                        {guests.adults}
                      </span>
                      <button
                        onClick={() => setGuests(prev => ({ ...prev, adults: Math.min(10, prev.adults + 1) }))}
                        disabled={guests.adults === 10}
                        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30"
                        style={{ borderColor: colors.border, color: colors.primary }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Trẻ em
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Từ 0-12 tuổi
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                        disabled={guests.children === 0}
                        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30"
                        style={{ borderColor: colors.border, color: colors.primary }}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium" style={{ color: colors.textPrimary }}>
                        {guests.children}
                      </span>
                      <button
                        onClick={() => setGuests(prev => ({ ...prev, children: Math.min(10, prev.children + 1) }))}
                        disabled={guests.children === 10}
                        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30"
                        style={{ borderColor: colors.border, color: colors.primary }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className="w-full mt-6 py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 button-hover relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: canSearch ? colors.primary : colors.textSecondary,
              borderRadius: borderRadius.button,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Search className="w-5 h-5" />
              {canSearch ? "Tìm kiếm khách sạn" : "Vui lòng nhập điểm đến và số khách"}
            </span>
          </button>
          
          {checkIn && checkOut && (
            <p className="text-xs text-center mt-3" style={{ color: colors.textSecondary }}>
              💡 Tip: Ngày là tùy chọn. Bạn có thể lọc theo ngày sau khi xem kết quả!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
