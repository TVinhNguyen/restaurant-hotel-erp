import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, MapPin, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function BookingConfirmationPage() {
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon and Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Your booking is now confirmed!</h2>
          </div>

          {/* Booking Details Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
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
                  <h3 className="text-2xl font-bold text-foreground mb-2">Hotel Norrebro</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Stellar hotel located in the heart of Copenhagen
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="text-primary font-medium">Standard double room</span>
                  </p>
                </div>

                {/* Trip Details */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">Your trip starts Friday, 09 December 2022</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-foreground">Check-in</p>
                        <p className="text-sm text-muted-foreground">Friday, 09 December 2022, from 3 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-foreground">Check-out</p>
                        <p className="text-sm text-muted-foreground">Monday, 12 December 2022, until 11 AM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Hotel address</p>
                      <p className="text-sm text-muted-foreground">Nørrebrogade 9, 1078 Copenhagen, Denmark</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">E-mail</p>
                      <p className="text-sm text-primary">desk@norrebro.dk</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Telephone</p>
                      <p className="text-sm text-muted-foreground">+45 000 000 000</p>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Total price</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">$600</p>
                      <Badge className="bg-accent text-accent-foreground">paid</Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="flex-1" size="lg">
                    Contact property
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" size="lg">
                    Cancel reservation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="text-center text-sm text-muted-foreground">
            <p>A confirmation email has been sent to your email address.</p>
            <p className="mt-2">
              Need help? Contact our{" "}
              <a href="#" className="text-primary hover:underline">
                customer support
              </a>
            </p>
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