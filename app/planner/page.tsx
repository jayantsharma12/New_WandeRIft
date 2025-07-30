"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Calendar, Users, Sparkles } from "lucide-react"

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

export default function PlannerPage() {
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
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-brand-black">Plan Your Next Adventure</h1>
          <p className="text-xl text-brand-lightGrey">
            Tell us about your preferences and let AI create your personalized spontaneous itinerary
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-brand-red/10">
            <CardTitle className="flex items-center space-x-2 text-brand-black">
              <Sparkles className="h-6 w-6 text-brand-red" />
              <span>Trip Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-gray-700 font-medium">
                  Destination *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-brand-red" />
                  <Input
                    id="destination"
                    placeholder="e.g., Manali, Shimla, Rishikesh"
                    value={formData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                    className="pl-12 h-12 border-gray-300 focus:border-brand-red focus:ring-brand-red"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="days" className="text-gray-700 font-medium">
                  Number of Days *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-brand-red" />
                  <Input
                    id="days"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.days}
                    onChange={(e) => handleInputChange("days", e.target.value)}
                    className="pl-12 h-12 border-gray-300 focus:border-brand-red focus:ring-brand-red"
                    min="1"
                    max="30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-gray-700 font-medium">
                  Budget Type *
                </Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-brand-red focus:ring-brand-red">
                    <SelectValue placeholder="Select budget type" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-gray-700 font-medium">
                  Number of Travelers
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-brand-red" />
                  <Input
                    id="travelers"
                    type="number"
                    placeholder="e.g., 4"
                    value={formData.travelers}
                    onChange={(e) => handleInputChange("travelers", e.target.value)}
                    className="pl-12 h-12 border-gray-300 focus:border-brand-red focus:ring-brand-red"
                    min="1"
                    max="20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-gray-700 font-medium">Educational Interests (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {educationalInterests.map((interest) => (
                  <div key={interest} className="flex items-center space-x-3">
                    <Checkbox
                      id={interest}
                      checked={formData.selectedInterests.includes(interest)}
                      onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                      className="border-brand-red/50 data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
                    />
                    <Label htmlFor={interest} className="text-sm font-normal cursor-pointer text-gray-700">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerateItinerary}
              className="w-full h-14 bg-brand-red hover:bg-brand-red/90 text-white font-semibold text-lg"
              disabled={isGenerating || !formData.destination || !formData.days || !formData.budget}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Generating Your Adventure Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-3" />
                  Generate Adventure Itinerary
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
