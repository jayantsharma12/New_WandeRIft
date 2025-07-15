"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Calendar, IndianRupee } from "lucide-react"
import { useRouter } from "next/navigation"

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
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Plan Your Mountain Adventure</h2>
          <p className="text-xl text-gray-600">
            Search for destinations and let AI create your perfect student-friendly itinerary
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                <Input
                  placeholder="Where to explore?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                <Input
                  placeholder="Budget range"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                <Input
                  placeholder="Travel dates"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <Button
                onClick={handleSearch}
                className="h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
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
