"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star, Wifi, Car, AirVent, Bath, CreditCard, MapPin, Bed, Loader2, Users, Maximize2, Waves, Wind, Tv, Coffee, ChevronLeft, ChevronRight, Calendar, Check, Phone, Mail, Globe, Clock, Utensils, X, User, CalendarDays, Clock3, MessageSquare, Tag } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import PropertyDetailSkeleton from "@/components/skeletons/PropertyDetailSkeleton"
import RoomCardSkeleton from "@/components/skeletons/RoomCardSkeleton"
import { propertiesService, type Property, type RoomType, type Room } from "@/lib/services/properties"
import { restaurantsService, type Restaurant } from "@/lib/services/restaurants"
import { guestsService } from "@/lib/services/guests"
import { reservationsService } from "@/lib/services/reservations"
import { promotionsService, type Promotion } from "@/lib/services/promotions"
import { authService } from "@/lib/auth"
import { colors, shadows, borderRadius } from "@/lib/designTokens"

// Table Booking Form Schema
const tableBookingSchema = z.object({
  bookingDate: z.string().min(1, "Vui lòng chọn ngày"),
  bookingTime: z.string().min(1, "Vui lòng chọn giờ"),
  numberOfGuests: z.number().min(1, "Số người phải lớn hơn 0"),
  firstName: z.string().min(1, "Vui lòng nhập họ"),
  lastName: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  specialRequests: z.string().optional(),
})

type TableBookingFormValues = z.infer<typeof tableBookingSchema>
import { showToast } from "@/lib/toast"

// Restaurant Image Carousel Component
function RestaurantImageCarousel({ restaurant, fullWidth = false }: { restaurant?: Restaurant; fullWidth?: boolean }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fallbacks = [
    "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
    "/modern-hotel-room-with-city-view-london.jpg",
    "/dark-modern-hotel-room-with-ambient-lighting.jpg",
    "/luxury-hotel-suite-with-marble-bathroom.jpg",
    "/modern-green-hotel-building-exterior.jpg",
  ]

  // Get all available images (from restaurant.images or fallbacks)
  const getAllImages = () => {
    if (restaurant?.images && restaurant.images.length > 0) {
      return restaurant.images
    }
    // Use restaurant ID to consistently select fallback images
    const id = restaurant?.id || ""
    const startIndex = id ? parseInt(id.replace(/-/g, '').slice(0, 8), 16) % fallbacks.length : 0
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

  return (
    <div 
      className={`${fullWidth ? 'w-full' : 'w-80'} ${fullWidth ? 'h-64' : 'h-56'} ${fullWidth ? '' : 'flex-shrink-0'} overflow-hidden relative group cursor-pointer`}
      style={{ borderRadius: borderRadius.image }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with carousel */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={restaurant?.name || `Restaurant - Image ${index + 1}`}
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
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentImageIndex(index)
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === currentImageIndex
                  ? 'w-5 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Room Image Carousel Component
function RoomImageCarousel({ roomType, roomId }: { roomType?: RoomType; roomId?: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fallbacks = [
    "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
    "/modern-hotel-room-with-city-view-london.jpg",
    "/dark-modern-hotel-room-with-ambient-lighting.jpg",
    "/luxury-hotel-suite-with-marble-bathroom.jpg",
    "/modern-hotel-room-with-city-view-london.jpg",
  ]

  // Get all available images (from roomType.images or fallbacks)
  const getAllImages = () => {
    if (roomType?.images && roomType.images.length > 0) {
      return roomType.images
    }
    // Use room ID or roomType ID to consistently select fallback images
    const id = roomId || roomType?.id || ""
    const startIndex = id ? parseInt(id.replace(/-/g, '').slice(0, 8), 16) % fallbacks.length : 0
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

  return (
    <div 
      className="w-80 h-56 flex-shrink-0 overflow-hidden relative group cursor-pointer"
      style={{ borderRadius: borderRadius.image }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with carousel */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={roomType?.name || `Room - Image ${index + 1}`}
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
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentImageIndex(index)
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === currentImageIndex
                  ? 'w-5 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loadingRestaurants, setLoadingRestaurants] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [restaurantTables, setRestaurantTables] = useState<any[]>([])
  const [loadingTables, setLoadingTables] = useState(false)
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false)
  const [selectedTableForBooking, setSelectedTableForBooking] = useState<any | null>(null)
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false)
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loadingPromotions, setLoadingPromotions] = useState(false)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  // Table Booking Form
  const tableBookingForm = useForm<TableBookingFormValues>({
    resolver: zodResolver(tableBookingSchema),
    defaultValues: {
      bookingDate: "",
      bookingTime: "",
      numberOfGuests: 2,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  })

  useEffect(() => {
    if (propertyId) {
      loadProperty()
      loadRoomTypes()
      loadPromotions()
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
  }, [property, roomTypes, rooms, restaurants])

  // Trigger observer again when restaurants are loaded
  useEffect(() => {
    if (restaurants.length > 0 && !loadingRestaurants) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const scrollRevealElements = document.querySelectorAll('.scroll-reveal')
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
        
        scrollRevealElements.forEach((element) => {
          if (!element.classList.contains("visible")) {
            element.classList.add("transition-all", "duration-700", "ease-out")
            observer.observe(element)
          }
        })
      }, 100)
      
      return () => {
        clearTimeout(timer)
      }
    }
  }, [restaurants, loadingRestaurants])

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

  const loadRestaurants = async () => {
    if (!propertyId || loadingRestaurants) return
    
    try {
      setLoadingRestaurants(true)
      // Call restaurants endpoint with propertyId, page, and limit
      const response = await restaurantsService.getRestaurants({ 
        propertyId: propertyId,
        page: 1,
        limit: 100 
      })
      // Backend returns { restaurants: Restaurant[], total: number }
      if (response && 'restaurants' in response && Array.isArray(response.restaurants)) {
        setRestaurants(response.restaurants)
      } else if (response && 'data' in response && Array.isArray((response as any).data)) {
        setRestaurants((response as any).data)
      } else {
        setRestaurants([])
      }
    } catch (err) {
      console.error("Failed to load restaurants:", err)
      setRestaurants([])
    } finally {
      setLoadingRestaurants(false)
    }
  }

  const loadPromotions = async () => {
    if (!propertyId || loadingPromotions) return

    try {
      setLoadingPromotions(true)
      const response = await promotionsService.getPromotions({
        propertyId,
        active: true,
        page: 1,
        limit: 10,
      })
      if (response && response.data) {
        setPromotions(response.data)
      } else {
        setPromotions([])
      }
    } catch (err) {
      console.error("Failed to load promotions:", err)
      setPromotions([])
    } finally {
      setLoadingPromotions(false)
    }
  }

  const handleTabChange = (value: string) => {
    if (value === "rooms") {
      // Always reload room types and rooms when tab is clicked
      loadRoomTypes()
      loadRooms(1)
    } else if (value === "restaurants") {
      // Always reload restaurants when tab is clicked
      loadRestaurants()
    }
  }

  const handleViewRestaurantDetails = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsRestaurantModalOpen(true)
    
    // Load tables if not already in restaurant data
    if ((restaurant as any).tables && Array.isArray((restaurant as any).tables) && (restaurant as any).tables.length > 0) {
      setRestaurantTables((restaurant as any).tables)
    } else {
      try {
        setLoadingTables(true)
        const tables = await restaurantsService.getTables(restaurant.id)
        setRestaurantTables(tables)
      } catch (err) {
        console.error("Failed to load tables:", err)
        setRestaurantTables([])
      } finally {
        setLoadingTables(false)
      }
    }
  }

  const handleSelectTable = (table: any) => {
    if (table.status !== 'available') {
      showToast.error("Bàn này không khả dụng")
      return
    }
    setSelectedTableForBooking(table)
    setIsBookingFormOpen(true)
    // Set default number of guests based on table capacity
    tableBookingForm.setValue("numberOfGuests", table.capacity)
  }

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false)
    setSelectedTableForBooking(null)
    tableBookingForm.reset()
  }

  const onSubmitTableBooking = async (data: TableBookingFormValues) => {
    if (!selectedRestaurant || !selectedTableForBooking) {
      showToast.error("Thiếu thông tin đặt bàn")
      return
    }

    setIsSubmittingBooking(true)

    try {
      // Get current user if logged in
      let user: { id: string; email: string; name?: string; phone?: string } | null = null
      
      if (authService.isAuthenticated()) {
        try {
          user = await authService.getCurrentUser()
        } catch (err) {
          console.error("Failed to get user ID:", err)
        }
      }

      // Find or create guest
      let guestId: string | undefined
      try {
        const emailToSearch = user?.email || data.email
        
        const existingGuest = await guestsService.findGuestByEmail(emailToSearch)
        if (existingGuest) {
          guestId = existingGuest.id
        } else {
          // Create guest
          const guestData = user 
            ? {
                name: user.name || `${data.firstName} ${data.lastName}`.trim(),
                email: user.email,
                phone: user.phone || data.phone,
              }
            : {
                name: `${data.firstName} ${data.lastName}`.trim(),
                email: data.email,
                phone: data.phone,
              }
          
          const newGuest = await guestsService.createGuest(guestData)
          guestId = newGuest.id
        }
      } catch (err) {
        console.error("Failed to create/find guest:", err)
        showToast.error("Không thể xử lý thông tin khách hàng")
        return
      }

      // Create table booking - map to backend format
      const bookingPayload: any = {
        restaurantId: selectedRestaurant.id,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        pax: data.numberOfGuests, // Backend expects 'pax' not 'numberOfGuests'
        contactName: `${data.firstName} ${data.lastName}`.trim(),
        contactPhone: data.phone || "",
        specialRequests: data.specialRequests,
      }

      // Add guestId if we have one
      if (guestId) {
        bookingPayload.guestId = guestId
      }

      // Add assignedTableId if we have a selected table
      if (selectedTableForBooking?.id) {
        bookingPayload.assignedTableId = selectedTableForBooking.id
      }

      await reservationsService.createTableBooking(bookingPayload as any)

      showToast.success("Đặt bàn thành công!")
      
      // Close form and refresh tables
      handleCloseBookingForm()
      
      // Reload tables to update status
      if (selectedRestaurant) {
        try {
          const tables = await restaurantsService.getTables(selectedRestaurant.id)
          setRestaurantTables(tables)
        } catch (err) {
          console.error("Failed to reload tables:", err)
        }
      }
    } catch (err) {
      console.error("Table booking error:", err)
      showToast.error(err instanceof Error ? err.message : "Không thể đặt bàn. Vui lòng thử lại.")
    } finally {
      setIsSubmittingBooking(false)
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

            {/* Promotions Section */}
            {promotions.length > 0 && (
              <div
                ref={(el) => {
                  sectionsRef.current[1] = el
                }}
                className="scroll-reveal opacity-0 translate-y-10 mb-8"
              >
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: borderRadius.card,
                    boxShadow: shadows.card,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: colors.lightBlue }}>
                      <Tag className="w-5 h-5" style={{ color: colors.primary }} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Khuyến mãi đặc biệt
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {promotions.map((promotion) => {
                      const validFrom = promotion.validFrom ? new Date(promotion.validFrom) : null
                      const validTo = promotion.validTo ? new Date(promotion.validTo) : null
                      const now = new Date()
                      const isActive = (!validFrom || now >= validFrom) && (!validTo || now <= validTo) && promotion.active

                      return (
                        <div
                          key={promotion.id}
                          className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
                          style={{
                            backgroundColor: isActive ? colors.lightBlue : '#F3F4F6',
                            borderColor: isActive ? colors.primary : colors.border,
                            boxShadow: shadows.card,
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  className="text-xs font-bold px-2 py-1"
                                  style={{
                                    backgroundColor: colors.primary,
                                    color: 'white',
                                  }}
                                >
                                  {promotion.code}
                                </Badge>
                                {!isActive && (
                                  <Badge
                                    className="text-xs px-2 py-1"
                                    style={{
                                      backgroundColor: '#EF4444',
                                      color: 'white',
                                    }}
                                  >
                                    Hết hạn
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-bold text-lg mb-1" style={{ color: colors.textPrimary }}>
                                Giảm {promotion.discountPercent}%
                              </h4>
                              {promotion.description && (
                                <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                                  {promotion.description}
                                </p>
                              )}
                            </div>
                          </div>
                          {(validFrom || validTo) && (
                            <div className="text-xs mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                              {validFrom && (
                                <p style={{ color: colors.textSecondary }}>
                                  Từ: {validFrom.toLocaleDateString('vi-VN')}
                                </p>
                              )}
                              {validTo && (
                                <p style={{ color: colors.textSecondary }}>
                                  Đến: {validTo.toLocaleDateString('vi-VN')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div
              ref={(el) => {
                sectionsRef.current[promotions.length > 0 ? 2 : 1] = el
              }}
              className="scroll-reveal opacity-0 translate-y-10"
            >
            <Tabs defaultValue="rooms" className="w-full" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4 mb-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: colors.lightBlue }}>
                <TabsTrigger value="rooms" className="font-semibold">Phòng</TabsTrigger>
                <TabsTrigger value="restaurants" className="font-semibold">Nhà hàng</TabsTrigger>
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
                              <RoomImageCarousel roomType={roomType} roomId={room.id} />
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
                              <RoomImageCarousel roomType={roomType} />
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

              <TabsContent value="restaurants" className="mt-8">
                <div className="space-y-6">
                  {loadingRestaurants ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <RoomCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : restaurants.length > 0 ? (
                    restaurants.map((restaurant, restaurantIndex) => (
                      <div
                        key={restaurant.id}
                        className="bg-white p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/20 scroll-reveal opacity-0 translate-y-10"
                        style={{
                          borderRadius: borderRadius.card,
                          boxShadow: shadows.card,
                          animationDelay: `${restaurantIndex * 0.1}s`,
                        }}
                      >
                        <div className="flex gap-6">
                          <RestaurantImageCarousel restaurant={restaurant} />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                  {restaurant.name}
                                </h4>
                                {restaurant.description && (
                                  <p className="text-sm mb-3" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    {restaurant.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div
                              className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b"
                              style={{ borderColor: colors.border }}
                            >
                              {(restaurant.cuisineType || restaurant.cuisine) && (
                                <div className="flex items-center gap-3">
                                  <div className="p-3 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                                    <Utensils className="w-5 h-5" style={{ color: colors.primary }} />
                                  </div>
                                  <div>
                                    <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Ẩm thực
                                    </p>
                                    <p className="font-semibold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {restaurant.cuisineType || restaurant.cuisine}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {restaurant.openingHours && (
                                <div className="flex items-center gap-3">
                                  <div className="p-3 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                                    <Clock className="w-5 h-5" style={{ color: colors.primary }} />
                                  </div>
                                  <div>
                                    <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Giờ mở cửa
                                    </p>
                                    <p className="font-semibold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {restaurant.openingHours}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {restaurant.rating !== undefined && restaurant.rating !== null && (
                                <div className="flex items-center gap-3">
                                  <div className="p-3 rounded-xl" style={{ backgroundColor: colors.lightBlue }}>
                                    <Star className="w-5 h-5 fill-current" style={{ color: colors.accent }} />
                                  </div>
                                  <div>
                                    <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Đánh giá
                                    </p>
                                    <p className="font-semibold" style={{ color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {restaurant.rating.toFixed(1)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {(restaurant.phone || restaurant.email || restaurant.location || restaurant.address) && (
                              <div className="flex items-center space-x-2 flex-wrap gap-2 mb-4">
                                {restaurant.phone && (
                                  <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    <Phone className="w-4 h-4" style={{ color: colors.primary }} />
                                    <span>{restaurant.phone}</span>
                                  </div>
                                )}
                                {restaurant.email && (
                                  <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    <Mail className="w-4 h-4" style={{ color: colors.primary }} />
                                    <span>{restaurant.email}</span>
                                  </div>
                                )}
                                {(restaurant.location || restaurant.address) && (
                                  <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
                                    <span>{restaurant.location || restaurant.address}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-end pt-4 border-t" style={{ borderColor: colors.border }}>
                              <Button
                                onClick={() => handleViewRestaurantDetails(restaurant)}
                                className="px-8 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                                style={{
                                  backgroundColor: colors.primary,
                                  borderRadius: borderRadius.button,
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                }}
                              >
                                Xem chi tiết
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className="bg-white p-12 text-center"
                      style={{
                        borderRadius: borderRadius.card,
                        boxShadow: shadows.card,
                      }}
                    >
                      <p className="mb-4" style={{ color: colors.textSecondary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Chưa có nhà hàng nào
                      </p>
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

      {/* Restaurant Details Modal */}
      <Dialog open={isRestaurantModalOpen} onOpenChange={setIsRestaurantModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {selectedRestaurant && (
            <>
              <DialogHeader className="pb-4 border-b" style={{ borderColor: colors.border }}>
                <DialogTitle className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                  {selectedRestaurant.name}
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed" style={{ color: colors.textSecondary }}>
                  {selectedRestaurant.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-8 pt-6">
                {/* Restaurant Image Carousel */}
                <div className="w-full rounded-2xl overflow-hidden" style={{ boxShadow: shadows.card }}>
                  <RestaurantImageCarousel restaurant={selectedRestaurant} fullWidth={true} />
                </div>

                {/* Restaurant Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(selectedRestaurant.cuisineType || selectedRestaurant.cuisine) && (
                    <div className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:scale-105" style={{ backgroundColor: colors.lightBlue, boxShadow: shadows.card }}>
                      <div className="p-4 rounded-xl bg-white flex-shrink-0" style={{ boxShadow: shadows.input }}>
                        <Utensils className="w-6 h-6" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                          Ẩm thực
                        </p>
                        <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                          {selectedRestaurant.cuisineType || selectedRestaurant.cuisine}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedRestaurant.openingHours && (
                    <div className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:scale-105" style={{ backgroundColor: colors.lightBlue, boxShadow: shadows.card }}>
                      <div className="p-4 rounded-xl bg-white flex-shrink-0" style={{ boxShadow: shadows.input }}>
                        <Clock className="w-6 h-6" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                          Giờ mở cửa
                        </p>
                        <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                          {selectedRestaurant.openingHours}
                        </p>
                      </div>
                    </div>
                  )}
                  {(selectedRestaurant.location || selectedRestaurant.address) && (
                    <div className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:scale-105" style={{ backgroundColor: colors.lightBlue, boxShadow: shadows.card }}>
                      <div className="p-4 rounded-xl bg-white flex-shrink-0" style={{ boxShadow: shadows.input }}>
                        <MapPin className="w-6 h-6" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                          Vị trí
                        </p>
                        <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                          {selectedRestaurant.location || selectedRestaurant.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tables Section */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                      Chọn bàn
                    </h3>
                    <Badge className="px-4 py-1.5 text-sm font-semibold" style={{ backgroundColor: colors.primary, color: 'white' }}>
                      {restaurantTables.length} bàn
                    </Badge>
                  </div>
                  {loadingTables ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
                    </div>
                  ) : restaurantTables.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {restaurantTables.map((table) => (
                        <div
                          key={table.id}
                          onClick={() => table.status === 'available' && handleSelectTable(table)}
                          className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                            table.status === 'available' 
                              ? 'hover:scale-105 hover:shadow-xl cursor-pointer' 
                              : 'opacity-60 cursor-not-allowed'
                          }`}
                          style={{
                            backgroundColor: table.status === 'available' ? colors.lightBlue : '#FEE2E2',
                            borderColor: table.status === 'available' ? colors.primary : '#EF4444',
                            boxShadow: shadows.card,
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${table.status === 'available' ? 'animate-pulse' : ''}`} style={{ backgroundColor: table.status === 'available' ? colors.success : '#EF4444' }} />
                              <span className="text-base font-bold" style={{ color: colors.textPrimary }}>
                                Bàn {table.tableNumber}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                              <Users className="w-4 h-4" style={{ color: colors.primary }} />
                              <span>Tối đa {table.capacity} người</span>
                            </div>
                            <Badge
                              className="text-xs font-semibold px-3 py-1"
                              style={{
                                backgroundColor: table.status === 'available' ? colors.success : '#EF4444',
                                color: 'white',
                              }}
                            >
                              {table.status === 'available' ? '✓ Trống' : '✗ Đã đặt'}
                            </Badge>
                            {table.status === 'available' && (
                              <p className="text-xs mt-3 font-bold text-center py-2 px-3 rounded-lg" style={{ backgroundColor: colors.primary, color: 'white' }}>
                                Nhấn để đặt bàn
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: colors.lightBlue }}>
                      <Users className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textSecondary }} />
                      <p className="text-lg font-medium" style={{ color: colors.textSecondary }}>
                        Chưa có bàn nào
                      </p>
                    </div>
                  )}
                </div>

                {/* Booking Form */}
                {isBookingFormOpen && selectedTableForBooking && (
                  <div className="mt-8 p-8 rounded-2xl border-2 transition-all animate-in slide-in-from-bottom-4" style={{ backgroundColor: colors.lightBlue, borderColor: colors.primary, boxShadow: shadows.cardHover }}>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: colors.border }}>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-white" style={{ boxShadow: shadows.input }}>
                          <CalendarDays className="w-6 h-6" style={{ color: colors.primary }} />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                            Đặt bàn {selectedTableForBooking.tableNumber}
                          </h4>
                          <p className="text-sm" style={{ color: colors.textSecondary }}>
                            Tối đa {selectedTableForBooking.capacity} người
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCloseBookingForm}
                        className="h-9 w-9 hover:bg-white/80"
                        style={{ borderRadius: borderRadius.button }}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <Form {...tableBookingForm}>
                      <form onSubmit={tableBookingForm.handleSubmit(onSubmitTableBooking)} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={tableBookingForm.control}
                            name="bookingDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-semibold" style={{ color: colors.textPrimary }}>
                                  <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
                                  Ngày đặt bàn
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="date"
                                      {...field}
                                      min={new Date().toISOString().split('T')[0]}
                                      className="bg-white h-12 pl-4 pr-4 text-base"
                                      style={{ borderRadius: borderRadius.input, borderColor: colors.border }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={tableBookingForm.control}
                            name="bookingTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-semibold" style={{ color: colors.textPrimary }}>
                                  <Clock3 className="w-4 h-4" style={{ color: colors.primary }} />
                                  Giờ đặt bàn
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                    className="bg-white h-12 pl-4 pr-4 text-base"
                                    style={{ borderRadius: borderRadius.input, borderColor: colors.border }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={tableBookingForm.control}
                          name="numberOfGuests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 font-semibold" style={{ color: colors.textPrimary }}>
                                <Users className="w-4 h-4" style={{ color: colors.primary }} />
                                Số người (Tối đa: {selectedTableForBooking.capacity})
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={selectedTableForBooking.capacity}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className="bg-white h-12 pl-4 pr-4 text-base"
                                  style={{ borderRadius: borderRadius.input, borderColor: colors.border }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={tableBookingForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-semibold" style={{ color: colors.textPrimary }}>
                                  <User className="w-4 h-4" style={{ color: colors.primary }} />
                                  Họ
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="bg-white h-12 pl-4 pr-4 text-base"
                                    style={{ borderRadius: borderRadius.input, borderColor: colors.border }}
                                    placeholder="Nhập họ của bạn"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={tableBookingForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-semibold" style={{ color: colors.textPrimary }}>
                                  <User className="w-4 h-4" style={{ color: colors.primary }} />
                                  Tên
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="bg-white h-12 pl-4 pr-4 text-base"
                                    style={{ borderRadius: borderRadius.input, borderColor: colors.border }}
                                    placeholder="Nhập tên của bạn"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={tableBookingForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-semibold" style={{ color: colors.textPrimary }}>
                                  <Mail className="w-4 h-4" style={{ color: colors.primary }} />
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    {...field} 
                                    className="bg-white h-12 pl-4 pr-4 text-base"
                                    style={{ borderRadius: borderRadius.input, borderColor: colors.border }}
                                    placeholder="your.email@example.com"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={tableBookingForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-semibold" style={{ color: colors.textPrimary }}>
                                  <Phone className="w-4 h-4" style={{ color: colors.primary }} />
                                  Số điện thoại
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="tel" 
                                    {...field} 
                                    className="bg-white h-12 pl-4 pr-4 text-base"
                                    style={{ borderRadius: borderRadius.input, borderColor: colors.border }}
                                    placeholder="0123 456 789"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={tableBookingForm.control}
                          name="specialRequests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 font-semibold" style={{ color: colors.textPrimary }}>
                                <MessageSquare className="w-4 h-4" style={{ color: colors.primary }} />
                                Yêu cầu đặc biệt (tùy chọn)
                              </FormLabel>
                              <FormControl>
                                <textarea
                                  {...field}
                                  rows={4}
                                  className="w-full px-4 py-3 rounded-xl border bg-white text-base resize-none focus:outline-none focus:ring-2 transition-all"
                                  style={{ 
                                    borderColor: colors.border,
                                    borderRadius: borderRadius.input,
                                    boxShadow: shadows.input,
                                  }}
                                  placeholder="Ví dụ: Bàn gần cửa sổ, yêu cầu không cay..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex gap-4 pt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseBookingForm}
                            className="flex-1 h-12 text-base font-semibold"
                            style={{ 
                              borderRadius: borderRadius.button,
                              borderColor: colors.border,
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmittingBooking}
                            className="flex-1 h-12 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                            style={{ 
                              backgroundColor: colors.primary,
                              borderRadius: borderRadius.button,
                            }}
                          >
                            {isSubmittingBooking ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <Check className="w-5 h-5 mr-2" />
                                Xác nhận đặt bàn
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
