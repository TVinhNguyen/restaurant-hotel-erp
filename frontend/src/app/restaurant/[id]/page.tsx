import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Clock, Utensils, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function RestaurantDetailPage() {
  const menuCategories = [
    {
      name: "Appetizers",
      items: [
        { 
          name: "Nordic Seafood Platter", 
          description: "Fresh seafood selection with traditional accompaniments", 
          price: 24,
          image: "/luxury-hotel-room-with-blue-accents-and-modern-des.jpg"
        },
        { 
          name: "Smoked Salmon Bruschetta", 
          description: "House-smoked salmon on artisan bread", 
          price: 18,
          image: "/modern-hotel-room-with-city-view-london.jpg"
        },
        { 
          name: "Danish Cheese Board", 
          description: "Selection of local cheeses with honey and nuts", 
          price: 22,
          image: "/modern-green-hotel-building-exterior.jpg"
        }
      ]
    },
    {
      name: "Main Courses",
      items: [
        { 
          name: "Nordic Salmon", 
          description: "Grilled salmon with seasonal vegetables and herb butter", 
          price: 28,
          image: "/dark-modern-hotel-room-with-ambient-lighting.jpg"
        },
        { 
          name: "Danish Beef Tenderloin", 
          description: "Tender beef with potato gratin and red wine sauce", 
          price: 35,
          image: "/luxury-hotel-suite-with-marble-bathroom.jpg"
        },
        { 
          name: "Vegetarian Nordic Bowl", 
          description: "Seasonal vegetables with quinoa and herb dressing", 
          price: 24,
          image: "/barcelona-spain-cityscape-with-sagrada-familia.jpg"
        }
      ]
    },
    {
      name: "Desserts",
      items: [
        { 
          name: "Copenhagen Tart", 
          description: "Traditional dessert with seasonal berries", 
          price: 12,
          image: "/london-england-red-double-decker-bus-and-big-ben.jpg"
        },
        { 
          name: "Danish Apple Cake", 
          description: "Warm apple cake with vanilla ice cream", 
          price: 14,
          image: "/croatia-coastal-town-with-blue-waters-and-red-roof.jpg"
        },
        { 
          name: "Chocolate Nordic", 
          description: "Dark chocolate mousse with sea salt", 
          price: 16,
          image: "/copenhagen-denmark-colorful-buildings-and-harbor.jpg"
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/property/1">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to hotel
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <img
              src="/modern-hotel-room-with-city-view-london.jpg"
              alt="Norrebro Restaurant"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/luxury-hotel-room-with-blue-accents-and-modern-des.jpg"
              alt="Restaurant dining area"
              className="w-full h-38 object-cover rounded-lg"
            />
            <img
              src="/dark-modern-hotel-room-with-ambient-lighting.jpg"
              alt="Restaurant bar"
              className="w-full h-38 object-cover rounded-lg"
            />
            <img
              src="/modern-green-hotel-building-exterior.jpg"
              alt="Restaurant terrace"
              className="w-full h-38 object-cover rounded-lg"
            />
            <img
              src="/luxury-hotel-suite-with-marble-bathroom.jpg"
              alt="Private dining room"
              className="w-full h-38 object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Norrebro Restaurant</h2>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Fine dining with Nordic cuisine</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Open: 11:30 AM - 10:00 PM
              </span>
              <span className="flex items-center">
                <Utensils className="h-3 w-3 mr-1" />
                Modern European
              </span>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-accent text-accent-foreground text-lg px-3 py-1">4.8★</Badge>
            <p className="text-sm text-muted-foreground mt-1">892 reviews</p>
          </div>
        </div>

        <div className="space-y-12">
          {menuCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">{category.name}</h3>
                <div className="w-24 h-0.5 bg-primary mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <Card key={itemIndex} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary text-primary-foreground font-semibold">
                          ${item.price}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">4.8</span>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs">
                            Add to order
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-foreground">Ready to dine with us?</h3>
                  <p className="text-sm text-muted-foreground">Reserve your table for an unforgettable experience</p>
                </div>
                <Link href="/restaurant/booking">
                  <Button size="lg" className="px-8">
                    Reserve a table
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-sm text-muted-foreground">Nørrebrogade 9, 1078 Copenhagen</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">+45 000 000 001</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-primary">restaurant@norrebro.dk</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
