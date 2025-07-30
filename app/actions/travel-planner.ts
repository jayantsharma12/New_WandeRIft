"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

interface TravelPlanRequest {
  destination: string
  days: string
  budget: string
  travelers: string
  interests: string[]
}

interface Activity {
  time: string
  title: string
  description: string
  duration: string
  cost: number
  experience: string
}

interface DayPlan {
  day: number
  title: string
  activities: Activity[]
}

interface TravelPlan {
  destination: string
  duration: string
  budget: string
  travelers: string
  totalCost: number
  itinerary: DayPlan[]
  budgetBreakdown: {
    accommodation: number
    food: number
    activities: number
    transportation: number
  }
  highlights: string[]
  culturalInsights: string[]
  userInterests: string[]
}

// Mock data for testing when API is not available
const generateMockTravelPlan = (request: TravelPlanRequest): TravelPlan => {
  const baseCost = request.budget === "budget" ? 5000 : request.budget === "luxury" ? 25000 : 15000
  const totalCost = baseCost * Number.parseInt(request.days)

  return {
    destination: request.destination,
    duration: `${request.days} days`,
    budget: request.budget,
    travelers: request.travelers,
    totalCost,
    itinerary: Array.from({ length: Number.parseInt(request.days) }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Exploring ${request.destination}`,
      activities: [
        {
          time: "9:00 AM",
          title: "Morning Exploration",
          description: `Start your day exploring the beautiful sights of ${request.destination}`,
          duration: "2 hours",
          cost: 500,
          experience: "Immerse yourself in the local culture and history",
        },
        {
          time: "12:00 PM",
          title: "Local Cuisine Experience",
          description: "Enjoy authentic local dishes at a recommended restaurant",
          duration: "1.5 hours",
          cost: 800,
          experience: "Taste traditional flavors and cooking techniques",
        },
        {
          time: "3:00 PM",
          title: "Cultural Site Visit",
          description: "Visit important cultural landmarks and museums",
          duration: "3 hours",
          cost: 600,
          experience: "Learn about the rich heritage and traditions",
        },
      ],
    })),
    budgetBreakdown: {
      accommodation: 40,
      food: 30,
      activities: 20,
      transportation: 10,
    },
    highlights: [
      `Authentic ${request.destination} cultural experience`,
      "Local cuisine and traditional dishes",
      "Historical landmarks and museums",
      "Scenic viewpoints and photography spots",
    ],
    culturalInsights: [
      `${request.destination} has a rich cultural heritage`,
      "Local traditions are deeply rooted in history",
      "The cuisine reflects diverse cultural influences",
      "Art and architecture showcase unique regional styles",
    ],
    userInterests: request.interests,
  }
}

export async function generateTravelPlan(request: TravelPlanRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey || apiKey === "your_actual_gemini_api_key_here") {
      console.log("Using mock data - Gemini API key not configured")
      return {
        success: true,
        data: generateMockTravelPlan(request),
        isMock: true,
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const interestsList = request.interests.join(", ")
    const budgetLevel =
      request.budget === "budget" ? "budget-friendly" : request.budget === "luxury" ? "luxury" : "moderate"

    const prompt = `Create a detailed ${request.days}-day travel itinerary for ${request.destination} for ${request.travelers} traveler(s) with a ${budgetLevel} budget.

Focus on these interests: ${interestsList}

Please provide a JSON response with the following structure:
{
  "destination": "${request.destination}",
  "duration": "${request.days} days",
  "budget": "${budgetLevel}",
  "travelers": "${request.travelers}",
  "totalCost": estimated_total_cost_in_local_currency,
  "itinerary": [
    {
      "day": 1,
      "title": "Day title focusing on main theme",
      "activities": [
        {
          "time": "9:00 AM",
          "title": "Activity name",
          "description": "Detailed description of the activity",
          "duration": "2 hours",
          "cost": cost_in_local_currency,
          "experience": "Cultural or educational insight about this activity"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": percentage_of_total,
    "food": percentage_of_total,
    "activities": percentage_of_total,
    "transportation": percentage_of_total
  },
  "highlights": ["Key highlight 1", "Key highlight 2", "Key highlight 3"],
  "culturalInsights": ["Cultural insight 1", "Cultural insight 2", "Cultural insight 3"],
  "userInterests": ["${interestsList}"]
}

Make sure the response is valid JSON only, no additional text.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response to ensure it's valid JSON
    let cleanedText = text.trim()

    // Remove markdown code blocks if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/, "").replace(/\n?```$/, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "")
    }

    try {
      const travelPlan: TravelPlan = JSON.parse(cleanedText)

      // Validate the structure
      if (!travelPlan.itinerary || !Array.isArray(travelPlan.itinerary)) {
        throw new Error("Invalid itinerary structure")
      }

      return {
        success: true,
        data: travelPlan,
        isMock: false,
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError)
      console.error("Raw response:", text)

      // Fallback to mock data if parsing fails
      console.log("Falling back to mock data due to parsing error")
      return {
        success: true,
        data: generateMockTravelPlan(request),
        isMock: true,
        parseError: parseError instanceof Error ? parseError.message : "Unknown parse error",
      }
    }
  } catch (error) {
    console.error("Travel plan generation error:", error)

    // Check if it's an API key error
    if (error instanceof Error && error.message.includes("API key not valid")) {
      return {
        success: false,
        error:
          "Invalid Gemini API key. Please visit /setup-gemini to configure your API key properly, or the app will use mock data.",
      }
    }

    // For other errors, fallback to mock data
    console.log("Falling back to mock data due to API error")
    return {
      success: true,
      data: generateMockTravelPlan(request),
      isMock: true,
      apiError: error instanceof Error ? error.message : "Unknown API error",
    }
  }
}
