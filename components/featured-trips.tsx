"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, IndianRupee, MapPin, Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { trips as staticTrips } from "@/lib/data"

interface Trip {
  id: number
  destination: string
  rating: number
  budget: string
  days: number
  cost: number
  interests: string[]
}

export default function FeaturedTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrips() {
      try {
        const data = await getTrips()
        setTrips(data.slice(0, 3)) // ✅ Only take top 3 for featured
      } catch (error) {
        console.error("Failed to fetch trips:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  if (loading) return <p className="text-center py-10 text-gray-500">Loading featured trips...</p>

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Featured Mountain Destinations</h2>
          <p className="text-xl text-gray-600">Discover popular student-friendly trips planned by our AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0">
              <div
                className="h-64 bg-cover bg-center relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                }}
              >
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{trip.destination}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-orange-400" />
                    <span>{trip.rating}</span>
                  </div>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{trip.destination} Adventure</CardTitle>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {trip.budget}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {trip.days} days
                  </div>
                  <div className="flex items-center text-gray-600">
                    <IndianRupee className="h-4 w-4 mr-2" />₹{trip.cost.toLocaleString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {trip.interests.join(", ")}
                  </div>
                </div>

                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                  <Link href={`/trip/${trip.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            <Link href="/compare">View All Destinations</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}