"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Calendar, IndianRupee, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image" // Import Image component
import { getTrips, type Trip } from "@/lib/data" // Import getTrips and Trip type

export default function FeaturedTrips() {
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedTrips = async () => {
      setLoading(true)
      setError(null)
      try {
        const allTrips = await getTrips()
        // Sort by rating and take the top 3, or just take the first 3 if not enough data
        const sortedTrips = allTrips.sort((a, b) => b.rating - a.rating).slice(0, 3)
        setFeaturedTrips(sortedTrips)
      } catch (err: any) {
        // Catch any type of error
        console.error("Failed to fetch featured trips:", err.message || err)
        setError("Failed to load featured trips. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedTrips()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </section>
    )
  }

  if (featuredTrips.length === 0) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <p className="text-muted-foreground text-lg">No featured trips available at the moment.</p>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-orange-950">Featured Mountain Destinations</h2>
          <p className="text-xl text-gray-600">Discover popular student-friendly trips planned by our AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0">
              <div className="relative h-64 w-full">
                <Image
                  src={trip.image_url || "/placeholder.svg?height=256&width=384&text=Trip+Image"} // Use image_url or placeholder
                  alt={`Image of ${trip.destination}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
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
                  <CardTitle className="text-xl text-orange-950">{trip.destination} Adventure</CardTitle>
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
                    <IndianRupee className="h-4 w-4 mr-2" />₹{(trip.cost ?? 0).toLocaleString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {(trip.interests ?? []).join(", ")}
                  </div>
                  {trip.total_seats !== undefined && trip.booked_seats !== undefined && (
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {trip.total_seats - trip.booked_seats} seats left
                    </div>
                  )}
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
