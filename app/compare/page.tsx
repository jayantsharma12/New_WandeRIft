"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { trips } from "@/lib/data"
import { Calendar, DollarSign, Filter, MapPin, Star } from "lucide-react"
import Trip from "next/link"
import { useState } from "react"
import { staticTrips } from "@/lib/data"

export default function ComparePage() {
  // ✅ fallback if trips is undefined
  const initialTrips = Array.isArray(staticTrips) ? staticTrips : []

  const [filteredTrips, setFilteredTrips] = useState(initialTrips)
  const [selectedTrips, setSelectedTrips] = useState<number[]>([])
  const [filters, setFilters] = useState({
    destination: "",
    budget: "All Budgets",
    minRating: "Any Rating",
    maxCost: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    let filtered = [...initialTrips]

    if (newFilters.destination) {
      filtered = filtered.filter((trip) =>
        trip.destination.toLowerCase().includes(newFilters.destination.toLowerCase()),
      )
    }

    if (newFilters.budget !== "All Budgets") {
      filtered = filtered.filter((trip) => trip.budget === newFilters.budget)
    }

    if (newFilters.minRating !== "Any Rating") {
      filtered = filtered.filter((trip) => trip.rating >= Number.parseFloat(newFilters.minRating))
    }

    if (newFilters.maxCost) {
      filtered = filtered.filter((trip) => trip.cost <= Number.parseInt(newFilters.maxCost))
    }

    setFilteredTrips(filtered)
  }

  const toggleTripSelection = (tripId: number) => {
    if (selectedTrips.includes(tripId)) {
      setSelectedTrips(selectedTrips.filter((id) => id !== tripId))
    } else if (selectedTrips.length < 2) {
      setSelectedTrips([...selectedTrips, tripId])
    }
  }

  const selectedTripData = selectedTrips
    .map((id) => initialTrips.find((trip) => trip.id === id))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Compare Trips</h1>
          <p className="text-muted-foreground text-lg">Select up to 2 trips to compare side by side</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search destination"
                value={filters.destination}
                onChange={(e) => handleFilterChange("destination", e.target.value)}
              />

              <Select value={filters.budget} onValueChange={(value) => handleFilterChange("budget", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Budgets">All Budgets</SelectItem>
                  <SelectItem value="Budget">Budget</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.minRating} onValueChange={(value) => handleFilterChange("minRating", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Min rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any Rating">Any Rating</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Max cost (₹)"
                type="number"
                value={filters.maxCost}
                onChange={(e) => handleFilterChange("maxCost", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Comparison Section */}
        {selectedTrips.length === 2 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Trip Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedTripData.map((trip) => (
                  <div key={trip!.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{trip!.destination}</h3>
                      <Badge variant="secondary">{trip!.budget}</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span>{trip!.days} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cost</span>
                        <span>₹{trip!.cost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span>{trip!.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Interests</span>
                        <span className="text-sm">{trip!.interests.join(", ")}</span>
                      </div>
                    </div>

                    <Button asChild className="w-full mt-4">
                      <Link href={`/trip/${trip!.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trip Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredTrips ?? []).map((trip) => (
            <Card
              key={trip.id}
              className={`cursor-pointer transition-all ${
                selectedTrips.includes(trip.id) ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg"
              }`}
              onClick={() => toggleTripSelection(trip.id)}
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative rounded-t-lg">
                <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{trip.destination}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{trip.rating}</span>
                  </div>
                </div>
                {selectedTrips.includes(trip.id) && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{trip.destination} Adventure</CardTitle>
                  <Badge variant="secondary">{trip.budget}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {trip.days} days
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2" />₹{trip.cost.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {trip.interests.join(", ")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No trips found matching your filters.</p>
            <Button
              onClick={() => {
                setFilters({ destination: "", budget: "All Budgets", minRating: "Any Rating", maxCost: "" })
                setFilteredTrips(initialTrips)
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
