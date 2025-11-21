"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User as UserIcon, CreditCard, Shield, Settings, Bell, LogOut, Edit, Calendar, MapPin, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { authService, type User } from "@/lib/auth"
import { reservationsService, type Reservation } from "@/lib/services/reservations"
import { guestsService } from "@/lib/services/guests"

type TabType = "personal" | "bookings"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("personal")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loadingReservations, setLoadingReservations] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const router = useRouter()

  const sidebarItems = [
    { icon: UserIcon, label: "Personal details", tab: "personal" as TabType, id: "personal" },
    { icon: Calendar, label: "My Bookings", tab: "bookings" as TabType, id: "bookings" },
    { icon: CreditCard, label: "Payment information", tab: "personal" as TabType, id: "payment", disabled: true },
    { icon: Shield, label: "Safety", tab: "personal" as TabType, id: "safety", disabled: true },
    { icon: Settings, label: "Preferences", tab: "personal" as TabType, id: "preferences", disabled: true },
    { icon: Bell, label: "Notifications", tab: "personal" as TabType, id: "notifications", disabled: true },
  ]

  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error("Failed to load user:", error)
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
      setIsLoading(false)
    }

    loadUser()
  }, [router])

  useEffect(() => {
    if (activeTab === "bookings" && user) {
      loadReservations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user])
  
  const loadReservations = async () => {
    if (!user) return
    
    setLoadingReservations(true)
    try {
      // Find guest by user email
      const guest = await guestsService.findGuestByEmail(user.email)
      if (guest) {
        const response = await reservationsService.getReservations({
          guestId: guest.id,
          limit: 50,
        })
        setReservations(response.data || [])
      }
    } catch (error) {
      console.error("Failed to load reservations:", error)
    } finally {
      setLoadingReservations(false)
    }
  }

  const handleCancelBooking = async (reservationId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    setCancellingId(reservationId)
    try {
      await reservationsService.cancelReservation(reservationId)
      // Reload reservations
      await loadReservations()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to cancel booking")
    } finally {
      setCancellingId(null)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "checked_in":
        return "default"
      case "checked_out":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-8">Profile settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sidebarItems.map((item, index) => {
                    const isActive = activeTab === item.id && !item.disabled
                    return (
                      <button
                        key={index}
                        onClick={() => !item.disabled && setActiveTab(item.id as TabType)}
                        disabled={item.disabled}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : item.disabled
                            ? "text-muted-foreground cursor-not-allowed opacity-50"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    )
                  })}
                  <Separator />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted text-foreground transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Log out</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "personal" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Personal details</CardTitle>
                  <p className="text-sm text-muted-foreground">Edit your personal details</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change photo
                    </Button>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-foreground">Full name</label>
                        <p className="text-foreground">{user.name || "Not set"}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <p className="text-foreground">{user.email}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    {user.phone && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-foreground">Phone</label>
                            <p className="text-foreground">{user.phone}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button>Save changes</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                  <p className="text-sm text-muted-foreground">View and manage your reservations</p>
                </CardHeader>
                <CardContent>
                  {loadingReservations ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : reservations.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">No bookings found</p>
                      <Link href="/properties">
                        <Button>Browse Properties</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((reservation) => (
                        <Card key={reservation.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-lg font-semibold">
                                    {reservation.property?.name || "Property"}
                                  </h3>
                                  <Badge variant={getStatusBadgeVariant(reservation.status)}>
                                    {reservation.status}
                                  </Badge>
                                </div>
                                {reservation.confirmationCode && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Confirmation: {reservation.confirmationCode}
                                  </p>
                                )}
                                {reservation.roomType && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {reservation.roomType.name}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">
                                  {reservation.currency || "$"}
                                  {typeof reservation.totalAmount === "number"
                                    ? reservation.totalAmount.toFixed(2)
                                    : typeof reservation.totalAmount === "string"
                                    ? parseFloat(reservation.totalAmount).toFixed(2)
                                    : "0.00"}
                                </p>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-start space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium">Check-in</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(reservation.checkIn)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium">Check-out</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(reservation.checkOut)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {reservation.property?.address && (
                              <div className="flex items-start space-x-2 mb-4">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                  {reservation.property.address}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center space-x-2 pt-4 border-t">
                              {reservation.status !== "cancelled" &&
                                reservation.status !== "checked_out" &&
                                reservation.status !== "checked_in" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelBooking(reservation.id)}
                                    disabled={cancellingId === reservation.id}
                                  >
                                    {cancellingId === reservation.id ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Cancelling...
                                      </>
                                    ) : (
                                      <>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel Booking
                                      </>
                                    )}
                                  </Button>
                                )}
                              {reservation.propertyId && (
                                <Link href={`/property/${reservation.propertyId}`} className="ml-auto">
                                  <Button variant="outline" size="sm">
                                    View Property
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {/* Additional Profile Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Your Travel Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bookings made</span>
                      <span className="text-sm font-medium">{reservations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Countries visited</span>
                      <span className="text-sm font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Member since</span>
                      <span className="text-sm font-medium">-</span>
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
