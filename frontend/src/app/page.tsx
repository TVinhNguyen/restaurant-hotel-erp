import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, Users, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
                <Button variant="ghost" size="sm">
                  Sign up
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Log in</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[500px] bg-gradient-to-r from-slate-900 to-slate-700 overflow-hidden">
          <img
            src="/luxury-hotel-room-with-modern-interior-design.jpg"
            alt="Luxury hotel room"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Book your stay with Tripster</h2>
              <p className="text-xl mb-8 text-white/90">1,480,086 rooms around the world are waiting for you!</p>

              {/* Search Form */}
              <Card className="bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <form action="/search" method="GET">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input name="location" placeholder="Where are you going?" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Check-in</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input name="checkin" type="date" placeholder="Add date" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Check-out</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input name="checkout" type="date" placeholder="Add date" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Guests</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input name="guests" type="number" placeholder="Number of guests" className="pl-10" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button type="submit" size="lg" className="px-8">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-foreground">Popular destinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/search?location=Barcelona">
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src="/barcelona-spain-cityscape-with-sagrada-familia.jpg"
                    alt="Barcelona"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h4 className="text-white text-xl font-semibold">Barcelona</h4>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/search?location=London">
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src="/london-england-red-double-decker-bus-and-big-ben.jpg"
                    alt="London"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h4 className="text-white text-xl font-semibold">London</h4>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/search?location=Croatia">
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src="/croatia-coastal-town-with-blue-waters-and-red-roof.jpg"
                    alt="Croatia"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h4 className="text-white text-xl font-semibold">Croatia</h4>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/search?location=Copenhagen">
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src="/copenhagen-denmark-colorful-buildings-and-harbor.jpg"
                    alt="Copenhagen"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h4 className="text-white text-xl font-semibold">Copenhagen</h4>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Hotels Loved by Guests */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-foreground">Hotels loved by guests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link href="/property/soho-hotel-london">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src="/modern-hotel-room-with-city-view-london.jpg"
                    alt="Soho Hotel London"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">9.6</Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-1">Soho Hotel London</h4>
                  <p className="text-sm text-muted-foreground mb-2">from $390/night</p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/property/hotel-norrebro">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src="/luxury-hotel-room-with-blue-accents-and-modern-des.jpg"
                    alt="Hotel Norrebro"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">9.2</Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-1">Hotel Norrebro</h4>
                  <p className="text-sm text-muted-foreground mb-2">from $180/night</p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/property/sunset-plaza-hotel">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src="/modern-green-hotel-building-exterior.jpg"
                    alt="Sunset Plaza Hotel"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">8.8</Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-1">Sunset Plaza Hotel</h4>
                  <p className="text-sm text-muted-foreground mb-2">from $120/night</p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                      <Star className="h-3 w-3 text-gray-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/property/three-quarters-hotel">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src="/dark-modern-hotel-room-with-ambient-lighting.jpg"
                    alt="Three Quarters Hotel"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">9.0</Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-1">Three Quarters Hotel</h4>
                  <p className="text-sm text-muted-foreground mb-2">from $150/night</p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/property/surfnturf-suites">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src="/luxury-hotel-suite-with-marble-bathroom.jpg"
                    alt="SurfnTurf Suites"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">9.4</Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-1">SurfnTurf Suites</h4>
                  <p className="text-sm text-muted-foreground mb-2">from $70/night</p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between bg-background rounded-lg p-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Psst!</h4>
                <p className="text-muted-foreground">
                  Do you want to get special offers and best prices for amazing stays?
                </p>
                <p className="text-sm text-muted-foreground">Sign up to join our Travel Club!</p>
              </div>
            </div>
            <Button>
              Sign up for newsletter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
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
