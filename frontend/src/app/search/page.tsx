import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Search, MapPin, Calendar, Users, Star, ArrowLeft, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function SearchResultsPage() {
  const searchResults = [
    {
      id: 1,
      name: "Hotel Norrebro",
      rating: 9.6,
      ratingText: "Excellent",
      reviews: 1203,
      location: "0.8 km from city centre",
      amenities: ["Breakfast included"],
      image: "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
      price: 180,
      originalPrice: null,
      nights: 3,
      guests: 2,
    },
    {
      id: 2,
      name: "Hotel Mitte",
      rating: 8.2,
      ratingText: "Very good",
      reviews: 856,
      location: "1.2 km from city centre",
      amenities: ["Free WiFi", "Breakfast included"],
      image: "/modern-hotel-room-with-city-view-london.jpg",
      price: 450,
      originalPrice: null,
      nights: 3,
      guests: 2,
    },
    {
      id: 3,
      name: "Hotel ZOO Copenhagen",
      rating: 8.0,
      ratingText: "Good",
      reviews: 1502,
      location: "2.5 km from city centre",
      amenities: ["Free WiFi"],
      image: "/modern-green-hotel-building-exterior.jpg",
      price: 220,
      originalPrice: null,
      nights: 3,
      guests: 2,
    },
    {
      id: 4,
      name: "Hotel Bonduel",
      rating: 6.2,
      ratingText: "Average",
      reviews: 203,
      location: "3.2 km from city centre",
      amenities: ["Free WiFi", "Breakfast included"],
      image: "/dark-modern-hotel-room-with-ambient-lighting.jpg",
      price: 60,
      originalPrice: null,
      nights: 3,
      guests: 2,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                Tripster
              </Link>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Properties
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Attractions
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Popular
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Sign up
              </Button>
              <Button size="sm">Log in</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
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
                    <Input placeholder="Copenhagen, Denmark" className="pl-10" defaultValue="Copenhagen, Denmark" />
                  </div>
                </div>

                {/* Check-in Date */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">Check-in date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Friday, 09 December 2022"
                      className="pl-10"
                      defaultValue="Friday, 09 December 2022"
                    />
                  </div>
                </div>

                {/* Check-out Date */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">Check-out date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Monday, 12 December 2022"
                      className="pl-10"
                      defaultValue="Monday, 12 December 2022"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="2 adults, 1 room" className="pl-10" defaultValue="2 adults, 1 room" />
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
                <h2 className="text-2xl font-bold">140 search results for</h2>
                <p className="text-muted-foreground">Copenhagen, Dec 9 - 12, 2 guests, 1 room</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by</span>
                <Button variant="outline" size="sm">
                  Price <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {searchResults.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <div className="w-64 h-48 flex-shrink-0">
                      <img
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold text-primary hover:underline cursor-pointer">
                              {hotel.name}
                            </h3>
                            <div className="flex text-yellow-400">
                              {[...Array(3)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{hotel.location}</p>

                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-1">
                              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                {hotel.rating}
                              </Badge>
                              <span className="text-sm font-medium">{hotel.ratingText}</span>
                              <span className="text-sm text-muted-foreground">{hotel.reviews} reviews</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Comfort room</div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>1x King size bed</span>
                              <span>1x bathroom</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {hotel.amenities.map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-foreground mb-1">${hotel.price}</div>
                          <div className="text-sm text-muted-foreground mb-4">
                            {hotel.nights} nights, {hotel.guests} guests
                          </div>
                          <Link href="/booking/dates">
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
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                2
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                3
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                4
              </Button>
              <span className="text-muted-foreground">...</span>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                25
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Help
                </a>
              </div>
              <div>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </a>
              </div>
              <div>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Customer service
                </a>
              </div>
              <div>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  How to guide
                </a>
              </div>
              <div>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}