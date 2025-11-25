import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Clock, Users, Calendar, Utensils } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function RestaurantConfirmationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Table reservation confirmed!</h2>
            <p className="text-muted-foreground">Your table is reserved at Norrebro Restaurant</p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src="/modern-hotel-room-with-city-view-london.jpg"
                    alt="Norrebro Restaurant"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Norrebro Restaurant</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <Badge className="bg-accent text-accent-foreground">4.8</Badge>
                    <span className="text-sm text-muted-foreground">Fine dining experience</span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">Your reservation details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Date</p>
                        <p className="text-sm text-muted-foreground">Friday, 09 December 2022</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Time</p>
                        <p className="text-sm text-muted-foreground">7:30 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Guests</p>
                        <p className="text-sm text-muted-foreground">4 people</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Utensils className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Table</p>
                        <p className="text-sm text-muted-foreground">Table #12</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-foreground">Restaurant address</p>
                    <p className="text-sm text-muted-foreground">Nørrebrogade 9, 1078 Copenhagen, Denmark</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Contact</p>
                    <p className="text-sm text-primary">restaurant@norrebro.dk</p>
                    <p className="text-sm text-muted-foreground">+45 000 000 001</p>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Important reminders</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Please arrive on time for your reservation</li>
                    <li>• Smart casual dress code applies</li>
                    <li>• Free cancellation up to 2 hours before</li>
                    <li>• Special dietary requirements can be accommodated</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="flex-1" size="lg">
                    Contact restaurant
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" size="lg">
                    Modify reservation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>A confirmation email has been sent to your email address.</p>
            <p className="mt-2">
              Need help? Contact our{" "}
              <a href="#" className="text-primary hover:underline">
                restaurant support
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}




