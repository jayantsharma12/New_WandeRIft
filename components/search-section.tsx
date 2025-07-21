"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, IndianRupee, MapPin, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchSection() {
  const [destination, setDestination] = useState("")
  const [budget, setBudget] = useState("")
  const [dates, setDates] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (!destination && !budget && !dates) {
      return
    }

    const params = new URLSearchParams()
    if (destination) params.set("destination", destination)
    if (budget) params.set("budget", budget)
    if (dates) params.set("dates", dates)

    const queryString = params.toString()
    router.push(`/planner${queryString ? `?${queryString}` : ""}`)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-brand-black">Plan Your Next Adventure</h2>
          <p className="text-xl text-brand-lightGrey">
            Search for destinations and let AI create your perfect spontaneous itinerary
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-brand-red" />
                <Input
                  placeholder="Where to explore?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-brand-red focus:ring-brand-red"
                />
              </div>

              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-brand-red" />
                <Input
                  placeholder="Budget range"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-brand-red focus:ring-brand-red"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-brand-red" />
                <Input
                  placeholder="Travel dates"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-brand-red focus:ring-brand-red"
                />
              </div>

              <Button
                onClick={handleSearch}
                className="h-12 bg-brand-red hover:bg-brand-red/90 text-white font-semibold"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
