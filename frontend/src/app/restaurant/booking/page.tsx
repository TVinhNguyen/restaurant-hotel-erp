"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Users, Clock, Utensils, Star } from "lucide-react"

const restaurantBookingSchema = z.object({
  date: z.string().min(1, "Reservation date is required"),
  time: z.string().min(1, "Reservation time is required"),
  guests: z.number().min(1, "At least 1 guest is required").max(12, "Maximum 12 guests per table"),
  occasion: z.string().optional(),
  specialRequests: z.string().optional(),
})

type RestaurantBookingFormValues = z.infer<typeof restaurantBookingSchema>

export default function RestaurantBookingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const form = useForm<RestaurantBookingFormValues>({
    resolver: zodResolver(restaurantBookingSchema),
    defaultValues: {
      date: "",
      time: "",
      guests: 2,
      occasion: "",
      specialRequests: "",
    },
  })

  const timeSlots = [
    "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"
  ]

  const occasions = [
    "Birthday celebration",
    "Anniversary",
    "Business dinner", 
    "Romantic dinner",
    "Family gathering",
    "Special occasion",
    "Casual dining"
  ]

  const onSubmit = async (data: RestaurantBookingFormValues) => {
    setIsLoading(true)
    setError("")
    
    try {
      localStorage.setItem("restaurant_booking", JSON.stringify(data))
      router.push("/restaurant/confirmation")
    } catch (error) {
      setError("Failed to make reservation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                Tripster
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/search" className="text-foreground hover:text-primary transition-colors">
                  Properties
                </Link>
                <Link href="/search" className="text-foreground hover:text-primary transition-colors">
                  Attractions
                </Link>
                <Link href="/search" className="text-foreground hover:text-primary transition-colors">
                  Popular
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/register">
                <Button variant="ghost" size="sm">Sign up</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Log in</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/property/hotel-norrebro">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to hotel
            </Button>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-8">Reserve a table</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5" />
                  <span>Table Reservation</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Book your table at Norrebro Restaurant
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reservation date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="date"
                                  className="pl-10"
                                  min={new Date().toISOString().split('T')[0]}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of guests</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  className="pl-10"
                                  min="1"
                                  max="12"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred time</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                              {timeSlots.map((time) => (
                                <Button
                                  key={time}
                                  type="button"
                                  variant={field.value === time ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => field.onChange(time)}
                                  className="text-xs"
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="occasion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occasion (optional)</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {occasions.map((occasion) => (
                                <Button
                                  key={occasion}
                                  type="button"
                                  variant={field.value === occasion ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => field.onChange(field.value === occasion ? "" : occasion)}
                                  className="text-xs"
                                >
                                  {occasion}
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special requests (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Dietary restrictions, seating preferences, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <div className="text-sm text-destructive text-center">
                        {error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Making reservation..." : "Reserve table"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src="/modern-hotel-room-with-city-view-london.jpg"
                      alt="Norrebro Restaurant"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-1">Norrebro Restaurant</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <Badge className="bg-accent text-accent-foreground">4.8</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fine dining experience with Nordic cuisine
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">Opening Hours</p>
                        <p className="text-muted-foreground">11:30 AM - 10:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Utensils className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">Cuisine</p>
                        <p className="text-muted-foreground">Modern European, Nordic</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Reservation Policy</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Free cancellation up to 2 hours before</li>
                      <li>• Maximum 12 guests per table</li>
                      <li>• Smart casual dress code</li>
                      <li>• Children welcome until 8:00 PM</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-background border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-primary mb-2">Tripster</h5>
              <p className="text-sm text-muted-foreground">Your favorite hotel booking experience since 1991</p>
              <p className="text-xs text-muted-foreground mt-2">Loved © 2023</p>
            </div>
            <div className="flex space-x-8 text-sm">
              <div>
                <a href="#" className="text-muted-foreground hover:text-foreground">Help</a>
              </div>
              <div>
                <a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a>
              </div>
              <div>
                <a href="#" className="text-muted-foreground hover:text-foreground">Customer service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

