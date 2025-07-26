"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Target, User, Zap } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const budgetTypes = ["Budget", "Moderate", "Luxury"]
const educationalInterests = [
  "History & Heritage",
  "Science & Technology", 
  "Art & Culture",
  "Nature & Wildlife",
  "Architecture",
  "Local Traditions",
  "Museums & Galleries",
  "Educational Workshops",
]

interface FormData {
  destination: string
  days: string
  budget: string
  travelers: string
  selectedInterests: string[]
}

export default function WonderRiftPlanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    destination: "",
    days: "",
    budget: "",
    travelers: "",
    selectedInterests: [],
  })

  useEffect(() => {
    const destination = searchParams.get("destination")
    const budget = searchParams.get("budget")
    const dates = searchParams.get("dates")

    if (destination || budget || dates) {
      setFormData({
        destination: destination || "",
        days: "",
        budget: budget || "",
        travelers: "",
        selectedInterests: [],
      })
    }
    setIsLoading(false)
  }, [])

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleInterestChange = useCallback((interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedInterests: checked
        ? [...prev.selectedInterests, interest]
        : prev.selectedInterests.filter((i) => i !== interest),
    }))
  }, [])

  const handleGenerateItinerary = useCallback(async () => {
    if (!formData.destination || !formData.days || !formData.budget) {
      alert("Please fill in all required fields")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: formData.destination,
          days: Number.parseInt(formData.days),
          budget: formData.budget,
          travelers: Number.parseInt(formData.travelers) || 1,
          interests: formData.selectedInterests,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Store the generated itinerary data
        sessionStorage.setItem("generatedItinerary", JSON.stringify(result.data))

        // Store any API notes
        if (result.note) {
          sessionStorage.setItem("apiNote", result.note)
        }

        // Navigate to itinerary page
        const params = new URLSearchParams({
          destination: formData.destination,
          days: formData.days,
          budget: formData.budget,
          travelers: formData.travelers || "1",
          interests: formData.selectedInterests.join(","),
        })

        router.push(`/itinerary?${params.toString()}`)
      } else {
        throw new Error(result.error || "Failed to generate itinerary")
      }
    } catch (error: any) {
      console.error("Error generating itinerary:", error)

      // Show specific error message
      if (error.message && error.message.includes("API key")) {
        alert("Please configure your Google Gemini API key in the environment variables to use AI features.")
      } else {
        alert("Failed to generate itinerary. Please check your internet connection and try again.")
      }
    } finally {
      setIsGenerating(false)
    }
  }, [formData, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Hero Section */}
      <div className="relative bg-white p-6 mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-yellow-600/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 text-black">Plan Your Timeline Adventure</h2>
          <p className="text-xl text-black mb-8">
  Let our AI Navigator customize your journey across space and time.
          </p>
          
          {/* Navigation Pills */}
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Chrono Travel Console */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>WanderRift TimeDock</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Temporal Destination */}
              <div>
                <Label htmlFor="destination" className="text-gray-300 font-medium">
                  WanderPoint Destination
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="destination"
                    placeholder="Ancient Rome, Tokyo, Medieval Paris..."
                    value={formData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 pr-12"
                  />
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-red-400" />
                </div>
              </div>

              {/* Days, Budget, Travelers Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300 font-medium">
                    Days in Timeline
                  </Label>
                  <Select value={formData.days} onValueChange={(value) => handleInputChange("days", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-red-500 mt-2">
                      <SelectValue placeholder="3 Days" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="1">1 Day</SelectItem>
                      <SelectItem value="2">2 Days</SelectItem>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="4">4 Days</SelectItem>           
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="6">6 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="8">8 Days</SelectItem>
                      <SelectItem value="9">9 Days</SelectItem>
                      <SelectItem value="10">10 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-gray-300 font-medium">
                    Budget Capacity
                  </Label>
                  <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-red-500 mt-2">
                      <SelectValue placeholder="Energy Tier 1 (Budget)" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="Budget">(Budget)</SelectItem>
                      <SelectItem value="Moderate">(Moderate)</SelectItem>
                      <SelectItem value="Luxury">(Luxury)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-gray-300 font-medium">
                    Time Travelers
                  </Label>
                  <Select value={formData.travelers} onValueChange={(value) => handleInputChange("travelers", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-red-500 mt-2">
                      <SelectValue placeholder="1 Traveler" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="1">1 Traveler</SelectItem>
                      <SelectItem value="2">2 Travelers</SelectItem>
                      <SelectItem value="4">4 Travelers</SelectItem>
                      <SelectItem value="6">6 Travelers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Chrono Educational Interests */}
              <div>
                <Label className="text-gray-300 font-medium">
                  Chrono Educational Interests
                </Label>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {[
                    { name: "History & Heritage", icon: "📜", color: "text-yellow-400" },
                    { name: "Science & Technology", icon: "🚀", color: "text-blue-400" },
                    { name: "Art & Culture", icon: "🏛️", color: "text-orange-400" },
                    { name: "Cuisine", icon: "🍽️", color: "text-yellow-400" },
                    { name: "Architecture", icon: "🏗️", color: "text-blue-400" },
                    { name: "Local Traditions", icon: "⚔️", color: "text-red-400" },
                    { name: "Nature & Wildlife", icon: "🌿", color: "text-green-400" },
                    { name: "Museums & Galleries", icon: "🎨", color: "text-green-400" }
                  ].map((interest) => (
                    <div key={interest.name} className="flex items-center space-x-3">
                      <Checkbox
                        id={interest.name}
                        checked={formData.selectedInterests.includes(interest.name)}
                        onCheckedChange={(checked) => handleInterestChange(interest.name, checked as boolean)}
                        className="border-red-400/50 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                      />
                      <Label htmlFor={interest.name} className="text-sm text-gray-300 cursor-pointer flex items-center space-x-2">
                        <span className={`text-lg ${interest.color}`}>{interest.icon}</span>
                        <span>{interest.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - AI Travel Core */}
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>AI Travel Core</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Circular Progress Display */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 p-1">
                    <div className="bg-gray-800 rounded-full w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-xs text-gray-400">Neural Link</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-gray-700 border-gray-600 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-white">AI Navigator Tip</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Select multiple interests to create a more diverse temporal journey experience.
                  </p>
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerateItinerary}
                disabled={isGenerating || !formData.destination || !formData.days || !formData.budget}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 h-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    <span>Calculating Timeline...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    <span>Generate Temporal Journey</span>
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Calculating timelines, please wait...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}