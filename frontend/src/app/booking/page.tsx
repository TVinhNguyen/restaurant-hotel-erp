"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Star, Clock, Ban, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { propertiesService } from "@/lib/services/properties"
import { ratePlansService } from "@/lib/services/rate-plans"
import { guestsService } from "@/lib/services/guests"
import { reservationsService } from "@/lib/services/reservations"
import { authService } from "@/lib/auth"

const bookingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  guestNotes: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingFormSchema>

export default function BookingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [property, setProperty] = useState<{ id: string; name: string; images?: string[]; address?: string; rating?: number } | null>(null)
  const [roomType, setRoomType] = useState<{ id: string; name: string; basePrice: number | string } | null>(null)
  const [ratePlan, setRatePlan] = useState<{ id: string; currency: string } | null>(null)
  const [bookingDates, setBookingDates] = useState<{ checkin: string; checkout: string; guests: number } | null>(null)
  const [bookingContext, setBookingContext] = useState<{ propertyId: string; roomTypeId: string; roomId?: string } | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [nights, setNights] = useState(0)
  const router = useRouter()

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      guestNotes: "",
    },
  })

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true)
        
        // Get booking context and dates from localStorage
        const contextStr = localStorage.getItem("booking_context")
        const datesStr = localStorage.getItem("booking_dates")
        
        if (!contextStr || !datesStr) {
          router.push("/properties")
          return
        }

        const context = JSON.parse(contextStr)
        const dates = JSON.parse(datesStr)
        
        setBookingContext(context)
        setBookingDates(dates)

        // Fetch property
        if (context.propertyId) {
          const prop = await propertiesService.getPropertyById(context.propertyId)
          setProperty(prop)
        }

        // Fetch room types
        let rt: { id: string; name: string; basePrice: number | string } | null = null
        if (context.roomTypeId) {
          const roomTypes = await propertiesService.getRoomTypes(context.propertyId)
          rt = roomTypes.find((r) => r.id === context.roomTypeId) || null
          if (rt) {
            setRoomType(rt)
            
            // Fetch rate plan
            const ratePlans = await ratePlansService.getRatePlans({
              propertyId: context.propertyId,
              roomTypeId: context.roomTypeId,
              limit: 1,
            })
            if (ratePlans.data && ratePlans.data.length > 0) {
              setRatePlan(ratePlans.data[0])
            }
          }
        }

        // Calculate nights and price
        if (dates.checkin && dates.checkout && rt) {
          const checkIn = new Date(dates.checkin)
          const checkOut = new Date(dates.checkout)
          const diffTime = checkOut.getTime() - checkIn.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          setNights(diffDays)

          // Calculate total price (base price * nights + tax + service)
          if (rt.basePrice) {
            const basePrice = typeof rt.basePrice === 'string' ? parseFloat(rt.basePrice) : rt.basePrice
            const subtotal = basePrice * diffDays
            const tax = subtotal * 0.1 // 10% tax
            const service = subtotal * 0.05 // 5% service fee
            setTotalPrice(subtotal + tax + service)
          }
        }

        // Pre-fill form with user data if logged in
        if (authService.isAuthenticated()) {
          try {
            const user = await authService.getCurrentUser()
            if (user.email) {
              form.setValue("email", user.email)
            }
            if (user.name) {
              const nameParts = user.name.split(" ")
              if (nameParts.length > 0) {
                form.setValue("firstName", nameParts[0])
                if (nameParts.length > 1) {
                  form.setValue("lastName", nameParts.slice(1).join(" "))
                }
              }
            }
            if (user.phone) {
              form.setValue("phone", user.phone)
            }
          } catch (err) {
            console.error("Failed to load user data:", err)
          }
        }
      } catch (err) {
        console.error("Failed to load booking data:", err)
        setError("Failed to load booking information. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadBookingData()
  }, [router, form])

  const onSubmit = async (data: BookingFormValues) => {
    if (!bookingContext || !bookingDates || !property || !roomType || !ratePlan) {
      setError("Missing booking information. Please start over.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Get current user if logged in
      let bookerUserId: string | undefined
      let user: { id: string; email: string; name?: string; phone?: string } | null = null
      
      if (authService.isAuthenticated()) {
        try {
          user = await authService.getCurrentUser()
          bookerUserId = user.id
        } catch (err) {
          console.error("Failed to get user ID:", err)
        }
      }

      // Find or create guest
      let guestId: string
      try {
        // If user is logged in, use user's email to find/create guest
        const emailToSearch = user?.email || data.email
        
        const existingGuest = await guestsService.findGuestByEmail(emailToSearch)
        if (existingGuest) {
          guestId = existingGuest.id
        } else {
          // Create guest from user info if logged in, otherwise from form data
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
        throw new Error("Failed to process guest information")
      }

      // Calculate price breakdown
      const basePrice = typeof roomType.basePrice === 'string' ? parseFloat(roomType.basePrice) : roomType.basePrice
      const subtotal = basePrice * nights
      const taxAmount = subtotal * 0.1
      const serviceAmount = subtotal * 0.05
      const finalTotal = subtotal + taxAmount + serviceAmount

      // Create reservation
      const reservation = await reservationsService.createReservation({
        propertyId: bookingContext.propertyId,
        guestId: guestId,
        roomTypeId: bookingContext.roomTypeId,
        ratePlanId: ratePlan.id,
        checkIn: bookingDates.checkin,
        checkOut: bookingDates.checkout,
        adults: bookingDates.guests || 2,
        children: 0,
        totalAmount: finalTotal,
        currency: ratePlan.currency || "USD",
        contactName: `${data.firstName} ${data.lastName}`.trim(),
        contactEmail: data.email,
        contactPhone: data.phone,
        guestNotes: data.guestNotes,
        channel: "website",
        bookerUserId: bookerUserId,
        assignedRoomId: bookingContext.roomId,
        taxAmount: taxAmount,
        serviceAmount: serviceAmount,
        paymentStatus: "unpaid",
        status: "pending",
      })

      // Save reservation ID for confirmation page
      localStorage.setItem("reservation_id", reservation.id)
      
      // Clear booking data
      localStorage.removeItem("booking_context")
      localStorage.removeItem("booking_dates")

      // Redirect to confirmation
      router.push("/booking/confirmation")
      } catch (err) {
      console.error("Booking error:", err)
      setError(err instanceof Error ? err.message : "Failed to complete booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!property || !roomType || !bookingDates) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">Missing booking information</p>
          <Link href="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const basePrice = typeof roomType.basePrice === 'string' ? parseFloat(roomType.basePrice) : roomType.basePrice
  const subtotal = basePrice * nights
  const taxAmount = subtotal * 0.1
  const serviceAmount = subtotal * 0.05

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          {bookingContext && (
            <Link href={`/property/${bookingContext.propertyId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-8">Book {property.name}</h2>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 2: Personal Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      1
                    </span>
                    <span>Personal data</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First name
                      </label>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        placeholder="e.g. Maria"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last name
                      </label>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        placeholder="e.g. Lind"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="email@email.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone number
                    </label>
                    <Input
                      id="phone"
                      {...form.register("phone")}
                      placeholder="+45 000 000 000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="guestNotes" className="text-sm font-medium">
                      Special requests (optional)
                    </label>
                    <Input
                      id="guestNotes"
                      {...form.register("guestNotes")}
                      placeholder="Any special requests or notes"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* House Rules */}
              <Card>
                <CardHeader>
                  <CardTitle>House rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Check-in time</p>
                        <p className="text-sm text-muted-foreground">From 3 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Check-out time</p>
                        <p className="text-sm text-muted-foreground">Until 11 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review */}
              <Card>
                <CardHeader>
                  <CardTitle>Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <Ban className="h-5 w-5 text-destructive" />
                      <span className="text-sm">No pets allowed</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Ban className="h-5 w-5 text-destructive" />
                      <span className="text-sm">No smoking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Ban className="h-5 w-5 text-destructive" />
                      <span className="text-sm">No partying</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Complete booking"}
              </Button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Property Image */}
                  {property.images && property.images.length > 0 && (
                    <div className="relative">
                      <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Property Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{property.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {property.rating && (
                        <div className="flex text-yellow-400">
                          {[...Array(Math.floor(property.rating))].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      )}
                      {property.address && (
                        <span className="text-sm text-muted-foreground">{property.address}</span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Room Details */}
                  <div>
                    <h4 className="font-medium mb-2">{roomType.name}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Price per night: ${basePrice.toFixed(2)}</p>
                      <p>{nights} {nights === 1 ? 'night' : 'nights'}</p>
                      <p>Check-in: {new Date(bookingDates.checkin).toLocaleDateString()}</p>
                      <p>Check-out: {new Date(bookingDates.checkout).toLocaleDateString()}</p>
                      <p>Guests: {bookingDates.guests || 2}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Price per night</span>
                      <span>${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee (5%)</span>
                      <span>${serviceAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>TOTAL</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
