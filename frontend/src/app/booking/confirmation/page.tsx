"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, MapPin, Mail, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { reservationsService, type Reservation } from "@/lib/services/reservations"
import { propertiesService } from "@/lib/services/properties"

export default function BookingConfirmationPage() {
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [property, setProperty] = useState<{ id: string; name: string; images?: string[]; address?: string; city?: string; country?: string; phone?: string; email?: string; rating?: number } | null>(null)
  const [roomType, setRoomType] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const reservationId = localStorage.getItem("reservation_id")
        if (!reservationId) {
          router.push("/properties")
          return
        }

        const res = await reservationsService.getReservationById(reservationId)
        setReservation(res)

        // Fetch property
        if (res.propertyId) {
          const prop = await propertiesService.getPropertyById(res.propertyId)
          setProperty(prop)
        }

        // Fetch room type
        if (res.roomTypeId && res.propertyId) {
          const roomTypes = await propertiesService.getRoomTypes(res.propertyId)
          const rt = roomTypes.find((r) => r.id === res.roomTypeId)
          if (rt) {
            setRoomType(rt)
          }
        }
      } catch (err) {
        console.error("Failed to load reservation:", err)
        setError(err instanceof Error ? err.message : "Failed to load reservation details")
      } finally {
        setLoading(false)
      }
    }

    loadReservation()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">{error || "Reservation not found"}</p>
          <Link href="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const checkInDate = new Date(reservation.checkIn)
  const checkOutDate = new Date(reservation.checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon and Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Your booking is now confirmed!</h2>
            {reservation.confirmationCode && (
              <p className="text-muted-foreground">Confirmation code: <span className="font-semibold">{reservation.confirmationCode}</span></p>
            )}
          </div>

          {/* Booking Details Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Property Image */}
                {property?.images && property.images.length > 0 && (
                  <div className="relative">
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property?.name || "Property"}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Property Info */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{property?.name || "Property"}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    {property?.rating && (
                      <div className="flex text-yellow-400">
                        {[...Array(Math.floor(property.rating))].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    )}
                    {property?.address && (
                      <span className="text-sm text-muted-foreground">{property.address}</span>
                    )}
                  </div>
                  {roomType && (
                    <p className="text-sm text-muted-foreground mb-4">
                      <span className="text-primary font-medium">{roomType.name}</span>
                    </p>
                  )}
                </div>

                {/* Trip Details */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">
                    Your trip starts {checkInDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-foreground">Check-in</p>
                        <p className="text-sm text-muted-foreground">
                          {checkInDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, from 3 PM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-foreground">Check-out</p>
                        <p className="text-sm text-muted-foreground">
                          {checkOutDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, until 11 AM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>Duration: {nights} {nights === 1 ? 'night' : 'nights'}</p>
                    <p>Guests: {reservation.adults} {reservation.adults === 1 ? 'adult' : 'adults'}{reservation.children ? `, ${reservation.children} ${reservation.children === 1 ? 'child' : 'children'}` : ''}</p>
                  </div>
                </div>

                {/* Contact Information */}
                {property && (
                  <div className="space-y-3">
                    {property.address && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Property address</p>
                          <p className="text-sm text-muted-foreground">{property.address}</p>
                          {property.city && property.country && (
                            <p className="text-sm text-muted-foreground">{property.city}, {property.country}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {property.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">E-mail</p>
                          <p className="text-sm text-primary">{property.email}</p>
                        </div>
                      </div>
                    )}
                    {property.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Telephone</p>
                          <p className="text-sm text-muted-foreground">{property.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Price Summary */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Total price</p>
                      {reservation.currency && (
                        <p className="text-sm text-muted-foreground">{reservation.currency}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        {reservation.currency || '$'}{typeof reservation.totalAmount === 'number' 
                          ? reservation.totalAmount.toFixed(2) 
                          : typeof reservation.totalAmount === 'string' 
                            ? parseFloat(reservation.totalAmount).toFixed(2) 
                            : '0.00'}
                      </p>
                      <Badge 
                        className={
                          reservation.paymentStatus === 'paid' 
                            ? 'bg-accent text-accent-foreground' 
                            : reservation.paymentStatus === 'unpaid'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {reservation.paymentStatus || 'pending'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {property && (
                    <Link href={`/property/${property.id}`} className="flex-1">
                      <Button className="w-full" size="lg">
                        View property
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="flex-1 bg-transparent" size="lg">
                    Cancel reservation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="text-center text-sm text-muted-foreground">
            <p>A confirmation email has been sent to {reservation.contactEmail || 'your email address'}.</p>
            <p className="mt-2">
              Need help? Contact our{" "}
              <a href="#" className="text-primary hover:underline">
                customer support
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
