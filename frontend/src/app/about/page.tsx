import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/components/layout/header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Tripster</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
              <p className="text-muted-foreground mb-4">
                Tripster is your trusted partner for finding the perfect accommodations and dining experiences. 
                We connect travelers with exceptional hotels, resorts, and restaurants around the world.
              </p>
              <p className="text-muted-foreground">
                Our mission is to make travel planning effortless and enjoyable, providing you with the best 
                options tailored to your preferences and budget.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Extensive selection of hotels and properties worldwide</li>
                <li>Restaurant reservations and dining experiences</li>
                <li>Real-time availability and pricing</li>
                <li>Secure booking and payment processing</li>
                <li>24/7 customer support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                Have questions or need assistance? We&apos;re here to help!
              </p>
              <Link href="/contact">
                <Button>Get in Touch</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}




