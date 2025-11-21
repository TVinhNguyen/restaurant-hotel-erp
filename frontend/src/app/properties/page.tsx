"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Search, MapPin, Calendar, Users, ArrowLeft, ChevronDown, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { propertiesService, type Property } from "@/lib/services/properties"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadProperties()
  }, [page])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await propertiesService.getProperties({
        page,
        limit: 10,
      })
      setProperties(response.data || [])
      setTotal(response.total || 0)
    } catch (err) {
      console.error("Failed to load properties:", err)
      setError(err instanceof Error ? err.message : "Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  const getRatingText = (rating?: number) => {
    if (!rating) return "No rating"
    if (rating >= 9) return "Excellent"
    if (rating >= 8) return "Very good"
    if (rating >= 7) return "Good"
    if (rating >= 6) return "Average"
    return "Below average"
  }

  const getLocationText = (property: Property) => {
    if (property.city && property.country) {
      return `${property.city}, ${property.country}`
    }
    if (property.address) {
      return property.address
    }
    return "Location not specified"
  }

  const getImageUrl = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0]
    }
    // Fallback images
    const fallbacks = [
      "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
      "/modern-hotel-room-with-city-view-london.jpg",
      "/modern-green-hotel-building-exterior.jpg",
      "/dark-modern-hotel-room-with-ambient-lighting.jpg",
    ]
    return fallbacks[parseInt(property.id) % fallbacks.length] || "/placeholder.svg"
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Your search</h3>

                {/* Destination */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Where are you going?" className="pl-10" />
                  </div>
                </div>

                {/* Check-in Date */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">Check-in date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      placeholder="Select check-in date"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Check-out Date */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">Check-out date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      placeholder="Select check-out date"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="number" placeholder="Number of guests" className="pl-10" min="1" />
                  </div>
                </div>

                <Button className="w-full mb-6">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>

                <Separator className="my-6" />

                {/* Popular Filters */}
                <div className="space-y-4">
                  <h4 className="font-medium">Popular filters</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="budget-hotel" />
                      <label htmlFor="budget-hotel" className="text-sm">
                        Budget hotel
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="breakfast" />
                      <label htmlFor="breakfast" className="text-sm">
                        Breakfast included
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="airport-shuttle" />
                      <label htmlFor="airport-shuttle" className="text-sm">
                        Free airport shuttle
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hotel-hostel" />
                      <label htmlFor="hotel-hostel" className="text-sm">
                        Hotel/Hostel included
                      </label>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Price per night */}
                <div className="space-y-4">
                  <h4 className="font-medium">Price per night</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-50" />
                      <label htmlFor="price-50" className="text-sm">
                        Less than $50
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-50-100" />
                      <label htmlFor="price-50-100" className="text-sm">
                        $50 to $100
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-100-150" />
                      <label htmlFor="price-100-150" className="text-sm">
                        $100 to $150
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-150" />
                      <label htmlFor="price-150" className="text-sm">
                        $150 and more
                      </label>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Guest rating */}
                <div className="space-y-4">
                  <h4 className="font-medium">Guest rating</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rating-any" />
                      <label htmlFor="rating-any" className="text-sm">
                        Any
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rating-excellent" />
                      <label htmlFor="rating-excellent" className="text-sm">
                        Excellent
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rating-very-good" />
                      <label htmlFor="rating-very-good" className="text-sm">
                        Very good
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rating-good" />
                      <label htmlFor="rating-good" className="text-sm">
                        Good
                      </label>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Property class */}
                <div className="space-y-4">
                  <h4 className="font-medium">Property class</h4>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <Button key={stars} variant="outline" size="sm" className="px-2 bg-transparent">
                        {stars}★
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {loading ? "Loading..." : `${total} properties found`}
                </h2>
                <p className="text-muted-foreground">Browse our available properties</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by</span>
                <Button variant="outline" size="sm">
                  Price <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={loadProperties}>Try again</Button>
                </CardContent>
              </Card>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No properties found</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-6">
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex">
                        <div className="w-64 h-48 flex-shrink-0">
                          <img
                            src={getImageUrl(property)}
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Link href={`/property/${property.id}`}>
                                  <h3 className="text-xl font-semibold text-primary hover:underline cursor-pointer">
                                    {property.name}
                                  </h3>
                                </Link>
                                {property.type && (
                                  <Badge variant="outline" className="text-xs">
                                    {property.type}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {getLocationText(property)}
                              </p>

                              {property.rating && (
                                <div className="flex items-center space-x-4 mb-3">
                                  <div className="flex items-center space-x-1">
                                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                      {property.rating.toFixed(1)}
                                    </Badge>
                                    <span className="text-sm font-medium">{getRatingText(property.rating)}</span>
                                  </div>
                                </div>
                              )}

                              {property.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {property.description}
                                </p>
                              )}

                              {property.amenities && property.amenities.length > 0 && (
                                <div className="flex items-center space-x-2 flex-wrap gap-2">
                                  {property.amenities.slice(0, 3).map((amenity, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                  {property.amenities.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{property.amenities.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="text-right ml-6">
                              <Link href={`/property/${property.id}`}>
                                <Button className="w-full">See booking options</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {total > 10 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, Math.ceil(total / 10)) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= Math.ceil(total / 10)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
