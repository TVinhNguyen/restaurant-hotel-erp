"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Star, Wifi, Car, AirVent, Bath, CreditCard, MapPin, Bed, Loader2, Users, Maximize2, Waves, Wind, Tv, Coffee, ChevronLeft, ChevronRight, Calendar, Check, Phone, Mail, Globe } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import PropertyDetailSkeleton from "@/components/skeletons/PropertyDetailSkeleton"
import RoomCardSkeleton from "@/components/skeletons/RoomCardSkeleton"
import { propertiesService, type Property, type RoomType, type Room } from "@/lib/services/properties"
import { authService } from "@/lib/auth"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [roomsPage, setRoomsPage] = useState(1)
  const [roomsTotal, setRoomsTotal] = useState(0)
  const [roomsLimit] = useState(10)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (propertyId) {
      loadProperty()
      loadRoomTypes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId])

  useEffect(() => {
    // Scroll reveal animation
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

    return () => observer.disconnect()
  }, [property, roomTypes, rooms])

  const loadProperty = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await propertiesService.getPropertyById(propertyId)
      setProperty(data)
    } catch (err) {
      console.error("Failed to load property:", err)
      setError(err instanceof Error ? err.message : "Failed to load property")
    } finally {
      setLoading(false)
    }
  }

  const loadRoomTypes = async () => {
    if (!propertyId) return
    
    try {
      // Try to get room types directly
      try {
        const roomTypesData = await propertiesService.getRoomTypes(propertyId)
        setRoomTypes(roomTypesData)
      } catch {
        // Fallback: try to get from property rooms endpoint
        try {
          const propertyData = await propertiesService.getPropertyRooms(propertyId)
          if (propertyData.roomTypes) {
            setRoomTypes(Array.isArray(propertyData.roomTypes) ? propertyData.roomTypes : [])
          }
        } catch (err) {
          console.error("Failed to load room types:", err)
        }
      }
    } catch (err) {
      console.error("Failed to load room types:", err)
    }
  }

  const handleBookNow = (roomTypeId?: string, roomId?: string) => {
    if (!authService.isAuthenticated()) {
      router.push("/login")
      return
    }
    const bookingContext = {
      propertyId: propertyId,
      roomTypeId: roomTypeId || null,
      roomId: roomId || null,
    }
    localStorage.setItem("booking_context", JSON.stringify(bookingContext))
    router.push("/booking/dates")
  }

  const loadRooms = async (page: number = 1) => {
    if (!propertyId || loadingRooms) return
    
    try {
      setLoadingRooms(true)
      try {
        const response = await propertiesService.getRooms(propertyId, {
          page,
          limit: roomsLimit,
        })
        
        if (response.data && Array.isArray(response.data)) {
          let allRoomTypes = roomTypes
          if (allRoomTypes.length === 0) {
            try {
              allRoomTypes = await propertiesService.getRoomTypes(propertyId)
              setRoomTypes(allRoomTypes)
            } catch {
              const propertyData = await propertiesService.getPropertyRooms(propertyId)
              if (propertyData.roomTypes) {
                allRoomTypes = propertyData.roomTypes
                setRoomTypes(allRoomTypes)
              }
            }
          }
          
          const roomsWithTypes = response.data.map((room: Room) => {
            const roomType = allRoomTypes.find((rt: RoomType) => rt.id === room.roomTypeId)
            return {
              ...room,
              roomType: roomType || undefined
            }
          })
          
          setRooms(roomsWithTypes)
          setRoomsTotal(response.total || response.data.length)
          setRoomsPage(page)
        }
      } catch (err) {
        console.error("Failed to load rooms:", err)
        try {
          const data = await propertiesService.getPropertyRooms(propertyId)
          if (data.roomTypes) {
            setRoomTypes(Array.isArray(data.roomTypes) ? data.roomTypes : [])
          }
          if (data.rooms) {
            const roomsWithTypes = Array.isArray(data.rooms) ? data.rooms.map((room: Room) => {
              const roomType = data.roomTypes?.find((rt: RoomType) => rt.id === room.roomTypeId)
              return {
                ...room,
                roomType: roomType || undefined
              }
            }) : []
            const startIndex = (page - 1) * roomsLimit
            const endIndex = startIndex + roomsLimit
            setRooms(roomsWithTypes.slice(startIndex, endIndex))
            setRoomsTotal(roomsWithTypes.length)
            setRoomsPage(page)
          }
        } catch (err2) {
          console.error("Failed to load property rooms:", err2)
        }
      }
    } catch (err) {
      console.error("Failed to load rooms:", err)
    } finally {
      setLoadingRooms(false)
    }
  }

  const handleRoomsTabChange = (value: string) => {
    if (value === "rooms") {
      // Load room types if not already loaded
      if (roomTypes.length === 0) {
        loadRoomTypes()
      }
      // Load rooms if not already loaded
      if (rooms.length === 0) {
        loadRooms(1)
      }
    }
  }

  const getImageUrl = (images?: string[], index: number = 0) => {
    if (images && images.length > index) {
      return images[index]
    }
    const fallbacks = [
      "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
      "/modern-hotel-room-with-city-view-london.jpg",
      "/modern-green-hotel-building-exterior.jpg",
      "/dark-modern-hotel-room-with-ambient-lighting.jpg",
      "/luxury-hotel-suite-with-marble-bathroom.jpg",
    ]
    return fallbacks[index % fallbacks.length] || "/placeholder.svg"
  }

  const getRatingText = (rating?: number) => {
    if (!rating) return "Chưa có đánh giá"
    if (rating >= 9) return "Xuất sắc"
    if (rating >= 8) return "Rất tốt"
    if (rating >= 7) return "Tốt"
    if (rating >= 6) return "Trung bình"
    return "Dưới trung bình"
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

  const nextImage = () => {
    const totalImages = property?.images?.length || 5
    setCurrentImageIndex((prev) => (prev + 1) % totalImages)
  }

  const prevImage = () => {
    const totalImages = property?.images?.length || 5
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <PropertyDetailSkeleton />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4" style={{ color: colors.textPrimary }}>{error || "Không tìm thấy khách sạn"}</p>
              <Button onClick={loadProperty} style={{ backgroundColor: colors.primary }}>
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [getImageUrl([], 0), getImageUrl([], 1), getImageUrl([], 2), getImageUrl([], 3), getImageUrl([], 4)]

  const displayImages = images.slice(0, 5)

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/properties">
            <Button variant="ghost" size="sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image Gallery */}
            <div
              className="bg-white p-6 mb-8"
              style={{
                borderRadius: borderRadius.card,
                boxShadow: shadows.card,
              }}
            >
              <div className="relative h-[700px] mb-6 overflow-hidden group" style={{ borderRadius: borderRadius.image }}>
                <img
                  src={displayImages[currentImageIndex] || "/placeholder.svg"}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer"
                      style={{ color: colors.primary }}
                    >
                      <ChevronLeft className="w-6 h-6" style={{ color: colors.primary }} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer"
                      style={{ color: colors.primary }}
                    >
                      <ChevronRight className="w-6 h-6" style={{ color: colors.primary }} />
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                      {displayImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className="w-2.5 h-2.5 rounded-full transition-all cursor-pointer"
                          style={{
                            backgroundColor: index === currentImageIndex ? colors.primary : 'rgba(255,255,255,0.6)',
                            width: index === currentImageIndex ? '24px' : '8px',
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {displayImages.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                  {displayImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className="relative h-32 overflow-hidden rounded-xl transition-all group cursor-pointer"
                      style={{
                        border: index === currentImageIndex ? `3px solid ${colors.primary}` : `2px solid ${colors.border}`,
                        boxShadow: index === currentImageIndex ? shadows.cardHover : 'none',
                      }}
                    >
                      <img 
                        src={img || "/placeholder.svg"} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-black/10" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div
              ref={(el) => {
                sectionsRef.current[0] = el
              }}
              className="bg-white p-8 mb-8 scroll-reveal opacity-0 translate-y-10"
              style={{
                borderRadius: borderRadius.card,
                boxShadow: shadows.card,
              }}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {property.propertyType && (
                      <Badge 
                        className="px-3 py-1 text-xs font-semibold"
                        style={{ 
                          backgroundColor: colors.lightBlue,
                          color: colors.primary,
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                      >
                        {property.propertyType}
                      </Badge>
                    )}
                    {property.rating && (
                      <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                        <Star className="w-4 h-4 fill-current" style={{ color: colors.accent }} />
                        <span className="font-bold text-base" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {property.rating.toFixed(1)}
                        </span>
                        <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          ({getRatingText(property.rating)})
                        </span>
                      </div>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {property.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
                    <span className="text-base font-medium" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {getLocationText()}
                    </span>
                  </div>
                </div>
              </div>

              {property.description && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Tổng quan
                  </h3>
                  <p className="leading-relaxed text-base" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {property.description}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              {(property.phone || property.email || property.website) && (
                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b"
                  style={{ borderColor: colors.border }}
                >
                  {property.phone && (
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:shadow-md transition-all" style={{ backgroundColor: colors.lightBlue }}>
                      <div className="p-3 rounded-xl bg-white" style={{ boxShadow: shadows.input }}>
                        <Phone className="w-6 h-6" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Điện thoại
                        </p>
                        <a
                          href={`tel:${property.phone}`}
                          className="font-bold text-base hover:opacity-70 transition-opacity block"
                          style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          {property.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {property.email && (
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:shadow-md transition-all" style={{ backgroundColor: colors.lightBlue }}>
                      <div className="p-3 rounded-xl bg-white" style={{ boxShadow: shadows.input }}>
                        <Mail className="w-6 h-6" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Email
                        </p>
                        <a
                          href={`mailto:${property.email}`}
                          className="font-bold text-base hover:opacity-70 transition-opacity block break-all"
                          style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          {property.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {property.website && (
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:shadow-md transition-all" style={{ backgroundColor: colors.lightBlue }}>
                      <div className="p-3 rounded-xl bg-white" style={{ boxShadow: shadows.input }}>
                        <Globe className="w-6 h-6" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Website
                        </p>
                        <a
                          href={property.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-base hover:opacity-70 transition-opacity block break-all"
                          style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          Xem website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Tiện nghi nổi bật
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => {
                      const amenityIcons: Record<string, typeof Wifi> = {
                        'WiFi': Wifi,
                        'Wifi': Wifi,
                        'Parking': Car,
                        'Air Conditioning': AirVent,
                        'Bathroom': Bath,
                        'TV': Tv,
                        'Minibar': Coffee,
                        'Ocean View': Waves,
                        'Sea View': Waves,
                      }
                      const Icon = amenityIcons[amenity] || Wifi
                      
                      return (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-3 rounded-xl hover:shadow-md transition-all"
                          style={{ backgroundColor: colors.lightBlue }}
                        >
                          <div className="p-2 rounded-lg bg-white" style={{ boxShadow: shadows.input }}>
                            <Icon className="w-5 h-5" style={{ color: colors.primary }} />
                          </div>
                          <span className="text-sm font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {amenity}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div
              ref={(el) => {
                sectionsRef.current[1] = el
              }}
              className="scroll-reveal opacity-0 translate-y-10"
            >
            <Tabs defaultValue="rooms" className="w-full" onValueChange={handleRoomsTabChange}>
              <TabsList className="grid w-full grid-cols-3 mb-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: colors.lightBlue }}>
                <TabsTrigger value="rooms" className="font-semibold">Phòng</TabsTrigger>
                <TabsTrigger value="amenities" className="font-semibold">Tiện nghi</TabsTrigger>
                <TabsTrigger value="policies" className="font-semibold">Chính sách</TabsTrigger>
              </TabsList>

              <TabsContent value="rooms" className="mt-8">
                <div className="space-y-6">
                  {loadingRooms ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <RoomCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : rooms.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Hiển thị {((roomsPage - 1) * roomsLimit) + 1} - {Math.min(roomsPage * roomsLimit, roomsTotal)} trong tổng số {roomsTotal} phòng
                        </p>
                      </div>
                      {rooms.map((room, roomIndex) => {
                        const roomType = room.roomType || roomTypes.find(rt => rt.id === room.roomTypeId)
                        const roomNumber = room.number || room.roomNumber
                        const maxGuests = roomType?.maxOccupancy || 
                          ((roomType?.maxAdults || 0) + (roomType?.maxChildren || 0))
                        
                        return (
                          <div
                            key={room.id}
                            className="bg-white p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/20 scroll-reveal opacity-0 translate-y-10"
                            style={{
                              borderRadius: borderRadius.card,
                              boxShadow: shadows.card,
                              animationDelay: `${roomIndex * 0.1}s`,
                            }}
                          >
                            <div className="flex gap-6">
                              {roomType?.images && roomType.images.length > 0 && (
                                <div className="w-48 h-32 flex-shrink-0 overflow-hidden" style={{ borderRadius: borderRadius.image }}>
                                  <img
                                    src={roomType.images[0] || "/placeholder.svg"}
                                    alt={roomType.name || `Room ${roomNumber}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {roomType?.name || `Phòng ${roomNumber}`}
                                      {roomNumber && (
                                        <span className="text-sm ml-2" style={{ color: colors.textSecondary }}>
                                          #{roomNumber}
                                        </span>
                                      )}
                                    </h4>
                                    {roomType?.description && (
                                      <p className="text-sm mb-3" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                        {roomType.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div
                                  className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b"
                                  style={{ borderColor: colors.border }}
                                >
                                  {maxGuests > 0 && (
                                    <div className="flex items-center gap-3">
                                      <div className="p-3 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                                        <Users className="w-5 h-5" style={{ color: colors.primary }} />
                                      </div>
                                      <div>
                                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          Sức chứa
                                        </p>
                                        <p className="font-semibold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          {maxGuests} người
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {room.viewType && (
                                    <div className="flex items-center gap-3">
                                      <div className="p-3 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                                        <Waves className="w-5 h-5" style={{ color: colors.primary }} />
                                      </div>
                                      <div>
                                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          View
                                        </p>
                                        <p className="font-semibold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          {room.viewType}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {roomType?.bedType && (
                                  <div className="flex items-center gap-2 mb-4">
                                    <Bed className="w-4 h-4" style={{ color: colors.textSecondary }} />
                                    <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {roomType.bedType}
                                    </span>
                                  </div>
                                )}

                                {roomType?.amenities && roomType.amenities.length > 0 && (
                                  <div className="flex items-center space-x-2 flex-wrap gap-2 mb-4">
                                    {roomType.amenities.slice(0, 5).map((amenity, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {amenity}
                                      </Badge>
                                    ))}
                                    {roomType.amenities.length > 5 && (
                                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                                        +{roomType.amenities.length - 5} tiện nghi khác
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: colors.border }}>
                                  <div>
                                    {roomType?.basePrice && (
                                      <>
                                        <p className="text-xs mb-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          Giá/đêm từ
                                        </p>
                                        <p className="text-2xl font-bold" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          {typeof roomType.basePrice === 'string' 
                                            ? parseFloat(roomType.basePrice).toLocaleString("vi-VN")
                                            : roomType.basePrice.toLocaleString("vi-VN")}đ
                                        </p>
                                      </>
                                    )}
                                  </div>
                                  {roomType && (
                                    <Button
                                      onClick={() => {
                                        setSelectedRoomType(roomType)
                                        handleBookNow(roomType.id)
                                      }}
                                      className="px-8 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                                      style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: borderRadius.button,
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                      }}
                                    >
                                      Đặt phòng ngay
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      
                      {/* Pagination */}
                      {roomsTotal > roomsLimit && (() => {
                        const totalPages = Math.ceil(roomsTotal / roomsLimit)
                        const getPageNumbers = () => {
                          const pages: (number | string)[] = []
                          if (totalPages <= 7) {
                            for (let i = 1; i <= totalPages; i++) {
                              pages.push(i)
                            }
                          } else {
                            pages.push(1)
                            if (roomsPage > 3) {
                              pages.push('...')
                            }
                            const start = Math.max(2, roomsPage - 1)
                            const end = Math.min(totalPages - 1, roomsPage + 1)
                            for (let i = start; i <= end; i++) {
                              if (i !== 1 && i !== totalPages) {
                                pages.push(i)
                              }
                            }
                            if (roomsPage < totalPages - 2) {
                              pages.push('...')
                            }
                            pages.push(totalPages)
                          }
                          return pages
                        }
                        
                        return (
                          <div className="flex justify-center items-center space-x-2 mt-8">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadRooms(roomsPage - 1)}
                              disabled={roomsPage === 1 || loadingRooms}
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Trước
                            </Button>
                            {getPageNumbers().map((page, index) => {
                              if (page === '...') {
                                return (
                                  <span key={`ellipsis-${index}`} className="px-2" style={{ color: colors.textSecondary }}>
                                    ...
                                  </span>
                                )
                              }
                              const pageNum = page as number
                              return (
                                <Button
                                  key={pageNum}
                                  variant={roomsPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => loadRooms(pageNum)}
                                  disabled={loadingRooms}
                                  style={{
                                    backgroundColor: roomsPage === pageNum ? colors.primary : "transparent",
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                  }}
                                >
                                  {pageNum}
                                </Button>
                              )
                            })}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadRooms(roomsPage + 1)}
                              disabled={roomsPage >= totalPages || loadingRooms}
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Sau
                            </Button>
                          </div>
                        )
                      })()}
                    </>
                  ) : roomTypes.length > 0 ? (
                    <div className="space-y-6">
                      {roomTypes.map((roomType, roomTypeIndex) => {
                        const maxGuests = roomType.maxOccupancy || 
                          ((roomType.maxAdults || 0) + (roomType.maxChildren || 0))
                        
                        return (
                          <div
                            key={roomType.id}
                            className="bg-white p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/20 scroll-reveal opacity-0 translate-y-10"
                            style={{
                              borderRadius: borderRadius.card,
                              boxShadow: shadows.card,
                              animationDelay: `${roomTypeIndex * 0.1}s`,
                            }}
                          >
                            <div className="flex gap-6">
                              {roomType.images && roomType.images.length > 0 && (
                                <div className="w-48 h-32 flex-shrink-0 overflow-hidden" style={{ borderRadius: borderRadius.image }}>
                                  <img
                                    src={roomType.images[0] || "/placeholder.svg"}
                                    alt={roomType.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {roomType.name}
                                    </h4>
                                    {roomType.description && (
                                      <p className="text-sm mb-3" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                        {roomType.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div
                                  className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b"
                                  style={{ borderColor: colors.border }}
                                >
                                  {maxGuests > 0 && (
                                    <div className="flex items-center gap-3">
                                      <div className="p-3 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                                        <Users className="w-5 h-5" style={{ color: colors.primary }} />
                                      </div>
                                      <div>
                                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          Sức chứa
                                        </p>
                                        <p className="font-semibold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          {maxGuests} người
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {roomType.bedType && (
                                    <div className="flex items-center gap-3">
                                      <div className="p-3 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                                        <Bed className="w-5 h-5" style={{ color: colors.primary }} />
                                      </div>
                                      <div>
                                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          Giường
                                        </p>
                                        <p className="font-semibold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                          {roomType.bedType}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {roomType.amenities && roomType.amenities.length > 0 && (
                                  <div className="flex items-center space-x-2 flex-wrap gap-2 mb-4">
                                    {roomType.amenities.slice(0, 5).map((amenity, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {amenity}
                                      </Badge>
                                    ))}
                                    {roomType.amenities.length > 5 && (
                                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                                        +{roomType.amenities.length - 5} tiện nghi khác
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: colors.border }}>
                                  <div>
                                    <p className="text-xs mb-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Giá/đêm từ
                                    </p>
                                    <p className="text-2xl font-bold" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {typeof roomType.basePrice === 'string' 
                                        ? parseFloat(roomType.basePrice).toLocaleString("vi-VN")
                                        : roomType.basePrice.toLocaleString("vi-VN")}đ
                                    </p>
                                  </div>
                                  <Button
                                    onClick={() => {
                                      setSelectedRoomType(roomType)
                                      handleBookNow(roomType.id)
                                    }}
                                    className="px-8 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                                    style={{
                                      backgroundColor: colors.primary,
                                      borderRadius: borderRadius.button,
                                      fontFamily: 'system-ui, -apple-system, sans-serif',
                                    }}
                                  >
                                    Đặt phòng ngay
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div
                      className="bg-white p-12 text-center"
                      style={{
                        borderRadius: borderRadius.card,
                        boxShadow: shadows.card,
                      }}
                    >
                      <p className="mb-4" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Chưa có phòng nào
                      </p>
                      <Button
                        onClick={() => handleBookNow()}
                        style={{
                          backgroundColor: colors.primary,
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                      >
                        Đặt phòng ngay
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-8">
                <div
                  className="bg-white p-8"
                  style={{
                    borderRadius: borderRadius.card,
                    boxShadow: shadows.card,
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Tiện nghi khách sạn
                  </h3>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.amenities.map((amenity, index) => {
                        const amenityIcons: Record<string, typeof Wifi> = {
                          'WiFi': Wifi,
                          'Wifi': Wifi,
                          'Parking': Car,
                          'Air Conditioning': AirVent,
                          'Bathroom': Bath,
                          'TV': Tv,
                          'Minibar': Coffee,
                          'Ocean View': Waves,
                          'Sea View': Waves,
                        }
                        const Icon = amenityIcons[amenity] || Wifi
                        
                        return (
                          <div 
                            key={index} 
                            className="flex items-center gap-3 p-4 rounded-xl hover:shadow-md transition-all"
                            style={{ backgroundColor: colors.lightBlue }}
                          >
                            <div className="p-2 rounded-lg bg-white" style={{ boxShadow: shadows.input }}>
                              <Icon className="w-5 h-5" style={{ color: colors.primary }} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              {amenity}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Tổng quan
                        </h4>
                        <ul className="space-y-1 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          <li>• WiFi miễn phí</li>
                          <li>• Bãi đỗ xe miễn phí</li>
                          <li>• Điều hòa</li>
                          <li>• Lễ tân 24/7</li>
                          <li>• Phòng không hút thuốc</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Dịch vụ
                        </h4>
                        <ul className="space-y-1 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          <li>• Dịch vụ phòng</li>
                          <li>• Dịch vụ giặt ủi</li>
                          <li>• Dịch vụ concierge</li>
                          <li>• Lưu trữ hành lý</li>
                          <li>• Bàn tour</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="policies" className="mt-8">
                <div
                  className="bg-white p-8"
                  style={{
                    borderRadius: borderRadius.card,
                    boxShadow: shadows.card,
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Chính sách khách sạn
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                      <div className="p-2 rounded-lg bg-white flex-shrink-0" style={{ boxShadow: shadows.input }}>
                        <Check className="w-6 h-6" style={{ color: colors.success }} />
                      </div>
                      <div>
                        <p className="font-bold text-base mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Check-in: 14:00 | Check-out: 12:00
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Check-in sớm và check-out muộn tùy theo tình trạng phòng
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                      <div className="p-2 rounded-lg bg-white flex-shrink-0" style={{ boxShadow: shadows.input }}>
                        <Check className="w-6 h-6" style={{ color: colors.success }} />
                      </div>
                      <div>
                        <p className="font-bold text-base mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Hủy miễn phí
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Hủy miễn phí trước 24 giờ nhận phòng
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                      <div className="p-2 rounded-lg bg-white flex-shrink-0" style={{ boxShadow: shadows.input }}>
                        <Check className="w-6 h-6" style={{ color: colors.success }} />
                      </div>
                      <div>
                        <p className="font-bold text-base mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Trẻ em và giường
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Trẻ em mọi lứa tuổi đều được chào đón. Giường phụ có sẵn theo yêu cầu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div
            ref={(el) => {
              sectionsRef.current[2] = el
            }}
            className="scroll-reveal opacity-0 translate-y-10"
          >
            {selectedRoomType ? (
              <div
                className="bg-white p-6 sticky top-24"
                style={{
                  borderRadius: borderRadius.card,
                  boxShadow: shadows.cardHover,
                }}
              >
                <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.border }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      className="px-2 py-1 text-xs"
                      style={{ 
                        backgroundColor: colors.lightBlue,
                        color: colors.primary,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {selectedRoomType.name}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Giá mỗi đêm từ
                  </p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold leading-none" style={{ color: colors.primary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {typeof selectedRoomType.basePrice === 'string' 
                        ? parseFloat(selectedRoomType.basePrice).toLocaleString("vi-VN")
                        : selectedRoomType.basePrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <p className="text-xs flex items-center gap-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <Check className="w-3 h-3" style={{ color: colors.success }} />
                    Đã bao gồm thuế và phí
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {selectedRoomType.maxAdults && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      <Users className="w-4 h-4" style={{ color: colors.primary }} />
                      <span>Tối đa {selectedRoomType.maxAdults} người lớn</span>
                    </div>
                  )}
                  {selectedRoomType.bedType && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      <Bed className="w-4 h-4" style={{ color: colors.primary }} />
                      <span>{selectedRoomType.bedType}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleBookNow(selectedRoomType.id)}
                  className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all mb-3 shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.button,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Đặt phòng ngay
                </Button>

                <p className="text-xs text-center flex items-center justify-center gap-1" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  <CreditCard className="w-3 h-3" />
                  Bạn sẽ chưa bị tính phí
                </p>
              </div>
            ) : (
              <div
                className="bg-white p-6 sticky top-24"
                style={{
                  borderRadius: borderRadius.card,
                  boxShadow: shadows.cardHover,
                }}
              >
                <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.border }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5" style={{ color: colors.primary }} />
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Đặt phòng
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Chọn phòng để xem giá và đặt phòng
                  </p>
                </div>

                <Button
                  onClick={() => handleBookNow()}
                  className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-all mb-3 shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.button,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Đặt phòng ngay
                </Button>

                <div className="space-y-2 text-xs" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3" style={{ color: colors.success }} />
                    <span>Hủy miễn phí trước 24h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3" style={{ color: colors.success }} />
                    <span>Thanh toán an toàn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3" style={{ color: colors.success }} />
                    <span>Xác nhận tức thì</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
