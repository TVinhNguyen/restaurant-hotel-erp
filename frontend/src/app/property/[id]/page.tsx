"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Star, Wifi, Car, AirVent, Bath, CreditCard, MapPin, Bed, Loader2, Users } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { propertiesService, type Property, type RoomType, type Room } from "@/lib/services/properties"
import { authService } from "@/lib/auth"

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

  useEffect(() => {
    if (propertyId) {
      loadProperty()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId])

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

  const handleBookNow = (roomTypeId?: string, roomId?: string) => {
    if (!authService.isAuthenticated()) {
      router.push("/login")
      return
    }
    // Save booking context
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
      // Try to get rooms with pagination
      try {
        const response = await propertiesService.getRooms(propertyId, {
          page,
          limit: roomsLimit,
        })
        
        if (response.data && Array.isArray(response.data)) {
          // Get room types to map with rooms
          let allRoomTypes = roomTypes
          if (allRoomTypes.length === 0) {
            try {
              allRoomTypes = await propertiesService.getRoomTypes(propertyId)
              setRoomTypes(allRoomTypes)
            } catch {
              // Try to get from property endpoint
              const propertyData = await propertiesService.getPropertyRooms(propertyId)
              if (propertyData.roomTypes) {
                allRoomTypes = propertyData.roomTypes
                setRoomTypes(allRoomTypes)
              }
            }
          }
          
          // Map rooms with their roomType information
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
        // Fallback: try property rooms endpoint
        try {
          const data = await propertiesService.getPropertyRooms(propertyId)
          if (data.roomTypes) {
            setRoomTypes(Array.isArray(data.roomTypes) ? data.roomTypes : [])
          }
          if (data.rooms) {
            // Map rooms with their roomType information
            const roomsWithTypes = Array.isArray(data.rooms) ? data.rooms.map((room: Room) => {
              const roomType = data.roomTypes?.find((rt: RoomType) => rt.id === room.roomTypeId)
              return {
                ...room,
                roomType: roomType || undefined
              }
            }) : []
            // Apply pagination manually
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
    if (value === "rooms" && rooms.length === 0) {
      loadRooms(1)
    }
  }

  const getImageUrl = (images?: string[], index: number = 0) => {
    if (images && images.length > index) {
      return images[index]
    }
    // Fallback images
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
    if (!rating) return "No rating"
    if (rating >= 9) return "Excellent"
    if (rating >= 8) return "Very good"
    if (rating >= 7) return "Good"
    if (rating >= 6) return "Average"
    return "Below average"
  }

  const getLocationText = () => {
    if (!property) return ""
    if (property.city && property.country) {
      return `${property.city}, ${property.country}`
    }
    if (property.address) {
      return property.address
    }
    return "Location not specified"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive mb-4">{error || "Property not found"}</p>
              <Button onClick={loadProperty}>Try again</Button>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/properties">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <img
              src={images[0] || "/placeholder.svg"}
              alt={property.name}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${property.name} ${index + 2}`}
                className="w-full h-38 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Property Info */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground mb-2">{property.name}</h2>
            <div className="flex items-center space-x-2 mb-2">
              {(property.propertyType || property.type) && (
                <Badge variant="outline">{property.propertyType || property.type}</Badge>
              )}
              <span className="text-sm text-muted-foreground">{getLocationText()}</span>
            </div>
            {property.address && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span>{property.address}</span>
                {property.city && <span>, {property.city}</span>}
                {property.country && <span>, {property.country}</span>}
              </div>
            )}
            {property.description && (
              <p className="text-sm text-muted-foreground mb-2">{property.description}</p>
            )}
            {/* Contact Information */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              {property.phone && (
                <span>📞 {property.phone}</span>
              )}
              {property.email && (
                <a href={`mailto:${property.email}`} className="hover:text-primary transition-colors">
                  ✉️ {property.email}
                </a>
              )}
              {property.website && (
                <a 
                  href={property.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  🌐 Website
                </a>
              )}
            </div>
          </div>
          {property.rating && (
            <div className="text-right ml-6">
              <Badge className="bg-accent text-accent-foreground text-lg px-3 py-1">
                {getRatingText(property.rating)} {property.rating.toFixed(1)}
              </Badge>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={handleRoomsTabChange}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="space-y-8">
              {/* Contact & Location Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact & Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-1">Address</h4>
                        <p className="text-sm text-muted-foreground">
                          {property.address || "Not specified"}
                          {property.city && <><br />{property.city}</>}
                          {property.country && <><br />{property.country}</>}
                        </p>
                      </div>
                      {property.phone && (
                        <div>
                          <h4 className="font-medium mb-1">Phone</h4>
                          <p className="text-sm text-muted-foreground">{property.phone}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {property.email && (
                        <div>
                          <h4 className="font-medium mb-1">Email</h4>
                          <a 
                            href={`mailto:${property.email}`} 
                            className="text-sm text-primary hover:underline"
                          >
                            {property.email}
                          </a>
                        </div>
                      )}
                      {property.website && (
                        <div>
                          <h4 className="font-medium mb-1">Website</h4>
                          <a 
                            href={property.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {property.website}
                          </a>
                        </div>
                      )}
                      {property.propertyType && (
                        <div>
                          <h4 className="font-medium mb-1">Property Type</h4>
                          <p className="text-sm text-muted-foreground">{property.propertyType}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Overview */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Property overview</h3>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      {property.amenities.slice(0, 5).map((amenity, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-2">
                          <Wifi className="h-8 w-8 text-primary" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <Wifi className="h-8 w-8 text-primary" />
                        <span className="text-sm">Free WiFi</span>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-2">
                        <Car className="h-8 w-8 text-primary" />
                        <span className="text-sm">Free parking</span>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-2">
                        <AirVent className="h-8 w-8 text-primary" />
                        <span className="text-sm">Air conditioning</span>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-2">
                        <Bath className="h-8 w-8 text-primary" />
                        <span className="text-sm">Private bathroom</span>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-2">
                        <CreditCard className="h-8 w-8 text-primary" />
                        <span className="text-sm">Key card access</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="mt-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Rooms</h3>
              
              {loadingRooms ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : rooms.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {((roomsPage - 1) * roomsLimit) + 1} - {Math.min(roomsPage * roomsLimit, roomsTotal)} of {roomsTotal} rooms
                    </p>
                  </div>
                  {rooms.map((room) => {
                    const roomType = room.roomType || roomTypes.find(rt => rt.id === room.roomTypeId)
                    const roomNumber = room.number || room.roomNumber
                    const maxGuests = roomType?.maxOccupancy || 
                      ((roomType?.maxAdults || 0) + (roomType?.maxChildren || 0))
                    
                    return (
                      <Card key={room.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          {roomType?.images && roomType.images.length > 0 && (
                            <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                              <img
                                src={roomType.images[0] || "/placeholder.svg"}
                                alt={roomType.name || `Room ${roomNumber}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-2">
                                  {roomType?.name || `Room ${roomNumber}`}
                                  {roomNumber && (
                                    <span className="text-sm text-muted-foreground ml-2">#{roomNumber}</span>
                                  )}
                                </h4>
                                {roomType?.description && (
                                  <p className="text-sm text-muted-foreground mb-3">{roomType.description}</p>
                                )}
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    {maxGuests > 0 && (
                                      <span className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        Max {maxGuests} guests
                                      </span>
                                    )}
                                    {room.floor && (
                                      <span className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        Floor {room.floor}
                                      </span>
                                    )}
                                    {room.viewType && (
                                      <span className="flex items-center">
                                        <Star className="h-4 w-4 mr-1" />
                                        {room.viewType}
                                      </span>
                                    )}
                                  </div>
                                  {roomType?.bedType && (
                                    <div className="flex items-center space-x-2">
                                      <Bed className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">{roomType.bedType} bed</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2">
                                    <Badge variant={room.operationalStatus === 'available' || room.status === 'available' ? 'default' : 'secondary'}>
                                      {room.operationalStatus || room.status || 'available'}
                                    </Badge>
                                    {room.housekeepingStatus && (
                                      <Badge variant="outline">
                                        {room.housekeepingStatus}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-6">
                                {roomType?.basePrice && (
                                  <>
                                    <div className="text-2xl font-bold text-foreground mb-1">
                                      ${typeof roomType.basePrice === 'string' ? parseFloat(roomType.basePrice).toFixed(2) : roomType.basePrice}
                                    </div>
                                    <div className="text-sm text-muted-foreground mb-4">per night</div>
                                  </>
                                )}
                                {roomType && (
                                  <Button onClick={() => handleBookNow(roomType.id)}>Book now</Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                  
                  {/* Pagination */}
                  {roomsTotal > roomsLimit && (() => {
                    const totalPages = Math.ceil(roomsTotal / roomsLimit)
                    const getPageNumbers = () => {
                      const pages: (number | string)[] = []
                      if (totalPages <= 7) {
                        // Show all pages if 7 or fewer
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i)
                        }
                      } else {
                        // Show first page
                        pages.push(1)
                        
                        if (roomsPage > 3) {
                          pages.push('...')
                        }
                        
                        // Show pages around current
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
                        
                        // Show last page
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
                        >
                          Previous
                        </Button>
                        {getPageNumbers().map((page, index) => {
                          if (page === '...') {
                            return (
                              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
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
                        >
                          Next
                        </Button>
                      </div>
                    )
                  })()}
                </div>
              ) : roomTypes.length > 0 ? (
                <div className="space-y-6">
                  {roomTypes.map((roomType) => {
                    const maxGuests = roomType.maxOccupancy || 
                      ((roomType.maxAdults || 0) + (roomType.maxChildren || 0))
                    
                    return (
                      <Card key={roomType.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          {roomType.images && roomType.images.length > 0 && (
                            <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                              <img
                                src={roomType.images[0] || "/placeholder.svg"}
                                alt={roomType.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-2">{roomType.name}</h4>
                                {roomType.description && (
                                  <p className="text-sm text-muted-foreground mb-3">{roomType.description}</p>
                                )}
                                <div className="space-y-2">
                                  {maxGuests > 0 && (
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        Max {maxGuests} guests
                                      </span>
                                    </div>
                                  )}
                                  {roomType.bedType && (
                                    <div className="flex items-center space-x-2">
                                      <Bed className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">{roomType.bedType} bed</span>
                                    </div>
                                  )}
                                  {roomType.amenities && roomType.amenities.length > 0 && (
                                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                                      {roomType.amenities.map((amenity, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {amenity}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-6">
                                <div className="text-2xl font-bold text-foreground mb-1">
                                  ${typeof roomType.basePrice === 'string' ? parseFloat(roomType.basePrice).toFixed(2) : roomType.basePrice}
                                </div>
                                <div className="text-sm text-muted-foreground mb-4">per night</div>
                                <Button onClick={() => handleBookNow(roomType.id)}>Book now</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">No rooms available</p>
                    <Button onClick={() => handleBookNow()}>Book now</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="restaurant" className="mt-8">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold">Restaurant</h3>
                      <p className="text-sm text-muted-foreground">Fine dining experience at the hotel</p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">4.8★</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="relative">
                      <img
                        src={getImageUrl(property.images, 1)}
                        alt="Restaurant interior"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Cuisine</h4>
                        <p className="text-sm text-muted-foreground">Modern European, Nordic specialties</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Opening Hours</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Breakfast: 7:00 AM - 10:30 AM</p>
                          <p>Lunch: 12:00 PM - 3:00 PM</p>
                          <p>Dinner: 6:00 PM - 10:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/restaurant/booking" className="flex-1">
                        <Button className="w-full" size="lg">
                          Reserve a table
                        </Button>
                      </Link>
                      <Link href={`/restaurant/${propertyId}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="lg">
                          View menu
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Property amenities</h3>
                {property.amenities && property.amenities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">General</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {property.amenities.map((amenity, index) => (
                          <li key={index}>• {amenity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">General</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Free WiFi</li>
                        <li>• Free parking</li>
                        <li>• Air conditioning</li>
                        <li>• 24-hour front desk</li>
                        <li>• Non-smoking rooms</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Services</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Room service</li>
                        <li>• Laundry service</li>
                        <li>• Concierge service</li>
                        <li>• Luggage storage</li>
                        <li>• Tour desk</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Property policies</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Check-in/Check-out</h4>
                    <p className="text-sm text-muted-foreground">
                      Check-in: 3:00 PM - 11:00 PM
                      <br />
                      Check-out: Until 11:00 AM
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Cancellation</h4>
                    <p className="text-sm text-muted-foreground">Free cancellation until 24 hours before check-in</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Children and beds</h4>
                    <p className="text-sm text-muted-foreground">
                      Children of all ages are welcome. Extra beds available upon request.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
