"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Calendar, IndianRupee, Users, XCircle, CalendarDays } from "lucide-react" // Added CalendarDays
import Link from "next/link"
import Image from "next/image"
import { getTrips, type Trip } from "@/lib/data"
import BookingModal from "@/components/booking-modal" // Import the BookingModal
import { supabase } from "@/lib/supabase"

export default function DestinationsPage() {
  const [allTrips, setAllTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndSubscribeTrips = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedTrips = await getTrips()
        setAllTrips(fetchedTrips)
      } catch (err: any) {
        console.error("Failed to fetch trips:", err.message || err)
        setError("Failed to load destinations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAndSubscribeTrips() // Initial fetch

    // Set up Supabase Realtime subscription
    const channel = supabase
      .channel("destinations_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "trips" }, (payload) => {
        console.log("Change received!", payload)
        // Re-fetch trips whenever there's a change in the 'trips' table
        fetchAndSubscribeTrips()
      })
      .subscribe()

    // Cleanup function for the subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/50 py-8 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  if (allTrips.length === 0) {
    return (
      <div className="min-h-screen bg-muted/50 py-8 text-center">
        <p className="text-muted-foreground text-lg">No destinations available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-brand-black">Explore Our Destinations</h1>
          <p className="text-muted-foreground text-lg">Find your next educational mountain adventure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTrips.map((trip) => {
            const seatsLeft = (trip.total_seats ?? 0) - (trip.booked_seats ?? 0)
            const isAvailable = seatsLeft > 0

            // Format dates for display on cards
            const startDate = trip.start_date
              ? new Date(trip.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "N/A"
            const endDate = trip.end_date
              ? new Date(trip.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "N/A"
            const formattedDates = trip.start_date && trip.end_date ? `${startDate} - ${endDate}` : "Dates TBD"

            return (
              <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={trip.image_url || "/placeholder.svg?height=192&width=288&text=Trip+Image"}
                    alt={`Image of ${trip.destination}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{trip.destination}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{trip.rating}</span>
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-brand-black">{trip.destination} Adventure</CardTitle>
                    <Badge variant="secondary" className="bg-brand-red/10 text-brand-red">
                      {trip.budget}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {trip.days} days
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <IndianRupee className="h-4 w-4 mr-2" />₹{(trip.cost ?? 0).toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {(trip.interests ?? []).join(", ")}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {seatsLeft} seats left
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {" "}
                      {/* New: Trip Dates */}
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {formattedDates}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {isAvailable ? (
                      <BookingModal trip={trip} />
                    ) : (
                      <Button className="w-full bg-brand-red hover:bg-brand-red/90" size="lg" disabled>
                        <XCircle className="h-5 w-5 mr-2" />
                        Sold Out
                      </Button>
                    )}
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href={`/trip/${trip.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
