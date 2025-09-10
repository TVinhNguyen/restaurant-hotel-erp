import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Wifi, Car, AirVent, Bath, CreditCard, MapPin, Bed } from "lucide-react"

export default function PropertyDetailPage() {
  const hotelImages = [
    "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
    "/modern-hotel-room-with-city-view-london.jpg",
    "/modern-green-hotel-building-exterior.jpg",
    "/dark-modern-hotel-room-with-ambient-lighting.jpg",
    "/luxury-hotel-suite-with-marble-bathroom.jpg",
  ]

  const rooms = [
    {
      id: 1,
      name: "Double standard room",
      size: "18 m²",
      bedType: "1x King size bed",
      amenities: ["1x bathroom", "Free WiFi"],
      image: "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg",
      price: 800,
      nights: 3,
      guests: 2,
    },
    {
      id: 2,
      name: "Comfort single room",
      size: "15 m²",
      bedType: "1x Single bed",
      amenities: ["1x bathroom", "Free WiFi"],
      image: "/modern-hotel-room-with-city-view-london.jpg",
      price: 220,
      nights: 3,
      guests: 1,
    },
    {
      id: 3,
      name: "Double standard room",
      size: "18 m²",
      bedType: "1x King size bed",
      amenities: ["1x bathroom", "Free WiFi", "City view"],
      image: "/dark-modern-hotel-room-with-ambient-lighting.jpg",
      price: 320,
      nights: 3,
      guests: 2,
    },
    {
      id: 4,
      name: "Double fancy room",
      size: "25 m²",
      bedType: "1x King size bed",
      amenities: ["1x bathroom", "Free WiFi", "Balcony", "City view"],
      image: "/luxury-hotel-suite-with-marble-bathroom.jpg",
      price: 520,
      nights: 3,
      guests: 2,
    },
  ]

  const reviews = [
    {
      id: 1,
      rating: 10,
      title: "Excellent value for the price",
      comment: "We enjoyed our stay at this hotel. We will definitely come back!",
      author: "David Eriksson",
      date: "Reviewed on 12 September 2022",
      category: "Excellent",
    },
    {
      id: 2,
      rating: 8.8,
      title: "Good hotel but noisy location",
      comment: "Good room facing the street and it was super noisy. Unfortunately, we couldn't change room.",
      author: "Rosa",
      date: "Reviewed on 10 September 2022",
      category: "Average",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-primary">Tripster</h1>
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

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <img
              src={hotelImages[0] || "/placeholder.svg"}
              alt="Hotel Norrebro main"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {hotelImages.slice(1, 5).map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Hotel Norrebro ${index + 2}`}
                className="w-full h-38 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Hotel Info */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Hotel Norrebro</h2>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Stellar hotel located in the heart of Copenhagen</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Check-in: Friday, 09 December 2022</span>
              <span>Check-out: Monday, 12 December 2022</span>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-accent text-accent-foreground text-lg px-3 py-1">Excellent 9.6</Badge>
            <p className="text-sm text-muted-foreground mt-1">1203 reviews</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="space-y-8">
              {/* Property Overview */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Property overview</h3>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="mt-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Rooms</h3>
              {rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={room.image || "/placeholder.svg"}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-2">{room.name}</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {room.size}
                              </span>
                              <span className="flex items-center">
                                <Bed className="h-3 w-3 mr-1" />
                                {room.bedType}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {room.amenities.map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <div className="text-sm text-muted-foreground mb-1">
                            {room.nights} nights, {room.guests} guests
                          </div>
                          <Button className="mb-2">Book now for ${room.price}</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Hotel amenities</h3>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Hotel policies</h3>
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

        {/* Reviews Section */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Reviews</h3>
                <Badge className="bg-accent text-accent-foreground text-lg px-3 py-1">9.6/10</Badge>
              </div>

              {/* Rating Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cleanliness</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={95} className="w-24" />
                      <span className="text-sm font-medium">9.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Amenities</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={88} className="w-24" />
                      <span className="text-sm font-medium">8.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-24" />
                      <span className="text-sm font-medium">9.2</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Location</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={96} className="w-24" />
                      <span className="text-sm font-medium">9.6</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Staff</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={94} className="w-24" />
                      <span className="text-sm font-medium">9.4</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WiFi Connection</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={90} className="w-24" />
                      <span className="text-sm font-medium">9.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{review.title}</h4>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                      <Badge
                        className={`${
                          review.category === "Excellent"
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {review.category} {review.rating}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{review.author}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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