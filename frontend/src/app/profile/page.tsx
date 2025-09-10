import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, CreditCard, Shield, Settings, Bell, UserPlus, LogOut, Edit, ArrowRight } from "lucide-react"

export default function ProfilePage() {
  const sidebarItems = [
    { icon: User, label: "Personal details", active: true },
    { icon: CreditCard, label: "Payment information", active: false },
    { icon: Shield, label: "Safety", active: false },
    { icon: Settings, label: "Preferences", active: false },
    { icon: Bell, label: "Notifications", active: false },
    { icon: UserPlus, label: "Add other passengers", active: false },
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
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
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

        <h2 className="text-2xl font-bold mb-8">Profile settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sidebarItems.map((item, index) => (
                    <button
                      key={index}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                        item.active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                  <Separator />
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted text-foreground transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Log out</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
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
                    <AvatarFallback className="text-lg">ML</AvatarFallback>
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
                      <p className="text-foreground">Maria Lind</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground">Location</label>
                      <p className="text-foreground">Hamburg, Germany</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <p className="text-foreground">maria@email.de</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground">Nationality</label>
                      <p className="text-foreground">German</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground">Date of birth</label>
                      <p className="text-foreground">06/11/1988</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Save changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">P</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Psst!</h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Do you want to get special offers and best prices for amazing stays?
                    </p>
                    <p className="text-sm text-muted-foreground">Sign up to join our Travel Club!</p>
                  </div>

                  <Button className="w-full">
                    Sign up now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Profile Stats */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Your Travel Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bookings made</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Countries visited</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Member since</span>
                      <span className="text-sm font-medium">2021</span>
                    </div>
                  </div>
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
