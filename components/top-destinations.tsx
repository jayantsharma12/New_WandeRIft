"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { getTrips, type Trip } from "@/lib/data"
import { supabase } from "@/lib/supabase"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"; // Import Link
import { useEffect, useState } from "react"

export default function TopDestinations() {
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndSubscribeTrips = async () => {
      setLoading(true)
      setError(null)
      try {
        const allTrips = await getTrips()
        const sortedTrips = allTrips.sort((a, b) => b.rating - a.rating).slice(0, 3)
        setFeaturedTrips(sortedTrips)
      } catch (err: any) {
        console.error("Failed to fetch featured trips:", err.message || err)
        setError("Failed to load top destinations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAndSubscribeTrips() // Initial fetch

    // Set up Supabase Realtime subscription
    const channel = supabase
      .channel("trips_changes")
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
      <section className="py-20 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </section>
    )
  }

  if (featuredTrips.length === 0) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-muted-foreground text-lg">No top destinations available at the moment.</p>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">TOP DESTINATIONS</h2>
          <p className="text-xl text-brand-lightGrey">Discover breathtaking routes and unforgettable experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTrips.map((trip) => (
            // Wrap the entire Card with Link
            <Link key={trip.id} href={`/trip/${trip.id}`} className="block">
              <Card className="overflow-hidden shadow-lg rounded-xl border-0 h-full flex flex-col">
                <div className="relative h-64 w-full">
                  <Image
                    src={trip.image_url || "/placeholder.svg?height=256&width=384&text=Trip+Image"}
                    alt={`Image of ${trip.destination}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-t-xl" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">{trip.destination}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={`bg-brand-red text-white px-3 py-1 rounded-full`}>{trip.budget}</Badge>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= trip.rating ? "fill-current text-yellow-400" : "text-gray-400"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Add a small content area to make the card more clickable if needed, or remove if image is enough */}
                <div className="p-4 flex-grow">
                  <h4 className="text-lg font-semibold text-brand-black">{trip.destination}</h4>
                  <p className="text-sm text-brand-lightGrey">
                    {trip.days} Days, {trip.budget}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
