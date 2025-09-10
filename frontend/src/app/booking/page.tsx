import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Star, Wifi, Car, AirVent, CreditCard, Clock, Ban } from "lucide-react"

export default function BookingPage() {
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

        <h2 className="text-2xl font-bold mb-8">Book Hotel Norrebro</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Property Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    1
                  </span>
                  <span>Property selection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Breakfast included</h4>
                  <p className="text-sm text-muted-foreground">Choose best option</p>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="separate-beds" defaultChecked />
                    <label htmlFor="separate-beds" className="text-sm">
                      2 separate beds
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="flex flex-col items-center space-y-2 p-3 border border-border rounded-lg">
                    <Wifi className="h-6 w-6 text-primary" />
                    <span className="text-xs text-center">Free WiFi</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-3 border border-border rounded-lg">
                    <Car className="h-6 w-6 text-primary" />
                    <span className="text-xs text-center">Free parking</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-3 border border-border rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <span className="text-xs text-center">City card access</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-3 border border-border rounded-lg">
                    <AirVent className="h-6 w-6 text-primary" />
                    <span className="text-xs text-center">Air conditioning</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Personal Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    2
                  </span>
                  <span>Personal data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First and Last name
                    </label>
                    <Input id="first-name" placeholder="e.g. Maria Lind" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </label>
                    <Input id="email" type="email" placeholder="email@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone number
                  </label>
                  <Input id="phone" placeholder="+45 000 000 000" />
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    3
                  </span>
                  <span>Payment details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="card-name" className="text-sm font-medium">
                    Name on card
                  </label>
                  <Input id="card-name" placeholder="e.g. Maria Lind" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="card-number" className="text-sm font-medium">
                    Card number
                  </label>
                  <Input id="card-number" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="expiry" className="text-sm font-medium">
                      Valid until
                    </label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cvc" className="text-sm font-medium">
                      CVC
                    </label>
                    <Input id="cvc" placeholder="000" />
                  </div>
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
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Hotel Image */}
                  <div className="relative">
                    <img
                      src="/luxury-hotel-room-with-blue-accents-and-modern-des.jpg"
                      alt="Hotel Norrebro"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Hotel Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Hotel Norrebro</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Stellar hotel located in the heart of Copenhagen
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span>Friday, 09 December 2022</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span>Monday, 12 December 2022</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Room Details */}
                  <div>
                    <h4 className="font-medium mb-2">Standard double room</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Price per night: $180</p>
                      <p>3 nights</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Price per night</span>
                      <span>$180</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3 nights</span>
                      <span>$540</span>
                    </div>
                    <div className="flex justify-between">
                      <span>City tax</span>
                      <span>$40</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>$20</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>TOTAL</span>
                      <span>$600</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Book now
                  </Button>
                </div>
              </CardContent>
            </Card>
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
