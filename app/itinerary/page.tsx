"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, IndianRupee, Users, Clock, BookOpen } from "lucide-react"
import Link from "next/link"

interface ItineraryActivity {
  time: string
  activity: string
  educational_value: string
  cost: number
  duration: string
}

interface ItineraryDay {
  day: number
  theme: string
  activities: ItineraryActivity[]
}

interface GeneratedItinerary {
  itinerary: ItineraryDay[]
  total_estimated_cost: number
  educational_highlights: string[]
  cultural_insights: string[]
  recommended_reading: string[]
}

export default function ItineraryPage() {
  const searchParams = useSearchParams()
  const [generatedData, setGeneratedData] = useState<GeneratedItinerary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const destination = searchParams.get("destination") || ""
  const days = Number.parseInt(searchParams.get("days") || "0")
  const budget = searchParams.get("budget") || ""
  const travelers = Number.parseInt(searchParams.get("travelers") || "1")
  const interests = searchParams.get("interests")?.split(",") || []

  useEffect(() => {
    const storedItinerary = sessionStorage.getItem("generatedItinerary")

    if (storedItinerary) {
      try {
        const parsed = JSON.parse(storedItinerary)
        setGeneratedData(parsed)
      } catch (error) {
        console.error("Error parsing stored itinerary:", error)
      }
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-brand-black">Your Adventure Itinerary</h1>
            <Button asChild className="bg-brand-red hover:bg-brand-red/90">
              <Link href="/planner">Plan Another Trip</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-brand-red" />
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-semibold text-brand-black">{destination}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-brand-red" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-brand-black">{days} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <IndianRupee className="h-5 w-5 text-brand-red" />
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-semibold text-brand-black">{budget}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-brand-red" />
                  <div>
                    <p className="text-sm text-gray-500">Travelers</p>
                    <p className="font-semibold text-brand-black">{travelers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-brand-red/10">
                <CardTitle className="text-brand-black">Adventure Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {generatedData?.itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-brand-red pl-8 pb-8 last:pb-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-brand-red text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                        {day.day}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-brand-black">Day {day.day}</h3>
                        <p className="text-brand-red font-medium">{day.theme}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="bg-white border border-gray-200 p-6 rounded-lg">
                          <div className="flex items-start space-x-4">
                            <Clock className="h-5 w-5 text-brand-red mt-1" />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-3">
                                <p className="font-semibold text-brand-black">{activity.time}</p>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="bg-brand-red/10 text-brand-red">
                                    {activity.duration}
                                  </Badge>
                                  {activity.cost > 0 && (
                                    <Badge variant="outline" className="border-brand-red/50 text-brand-red">
                                      ₹{activity.cost}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-gray-700 mb-3">{activity.activity}</p>
                              <div className="flex items-start space-x-2">
                                <BookOpen className="h-4 w-4 text-brand-red mt-0.5" />
                                <p className="text-sm text-brand-red italic">
                                  <strong>Experience:</strong> {activity.educational_value}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No itinerary data available.</p>
                    <Button asChild className="bg-brand-red hover:bg-brand-red/90">
                      <Link href="/planner">Generate New Itinerary</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-brand-red/10">
                <CardTitle className="text-brand-black">Budget Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-brand-black">
                      ₹{generatedData?.total_estimated_cost?.toLocaleString() || "0"}
                    </p>
                    <p className="text-gray-500">Total Estimated Cost</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Accommodation (40%)</span>
                      <span>₹{Math.round((generatedData?.total_estimated_cost || 0) * 0.4).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Food & Dining (30%)</span>
                      <span>₹{Math.round((generatedData?.total_estimated_cost || 0) * 0.3).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Activities & Entry Fees (20%)</span>
                      <span>₹{Math.round((generatedData?.total_estimated_cost || 0) * 0.2).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transportation (10%)</span>
                      <span>₹{Math.round((generatedData?.total_estimated_cost || 0) * 0.1).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-brand-black">Adventure Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedData?.educational_highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-2" />
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </div>
                  )) || <p className="text-gray-500 text-sm">Adventure highlights will appear here</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-brand-black">Cultural Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedData?.cultural_insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-blue rounded-full mt-2" />
                      <span className="text-sm text-gray-700">{insight}</span>
                    </div>
                  )) || <p className="text-gray-500 text-sm">Cultural insights will appear here</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-brand-black">Your Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="bg-brand-green/10 text-brand-green">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
