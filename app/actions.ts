"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { put } from "@vercel/blob"

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

interface BookingRequest {
  tripId: string
  userName: string
  userEmail: string
  userPhone: string
  numTravelers: string
  paymentMethodId: string
  paymentScreenshot?: File
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
          "Invalid Gemini API key. Please visit /admin to configure your API key properly, or the app will use mock data.",
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

// Update the sendBookingToTelegram function to better handle chat not found errors
// and add a validation check before attempting to send messages

async function sendBookingToTelegram(bookingData: any) {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    // Check if Telegram credentials are configured
    if (!BOT_TOKEN || !CHAT_ID) {
      console.log("Telegram notification skipped: credentials not configured")
      return {
        success: false,
        error: "Telegram not configured",
        isSilentError: true, // Mark as silent error to not fail the booking
      }
    }

    // Check for placeholder values
    if (CHAT_ID === "your_personal_chat_id_here" || CHAT_ID === "your_chat_id_here") {
      console.log("Telegram notification skipped: chat ID not configured (still using placeholder)")
      return {
        success: false,
        error: "Telegram chat ID not configured - still using placeholder value",
        isSilentError: true,
      }
    }

    // Validate chat ID format (should be a number or a string starting with -)
    if (!/^-?\d+$/.test(CHAT_ID)) {
      console.error("Invalid Telegram chat ID format:", CHAT_ID)
      return {
        success: false,
        error: `Invalid chat ID format: ${CHAT_ID}. Chat ID should be a number (e.g., 123456789 or -123456789)`,
        isSilentError: true,
      }
    }

    // Format message for booking
    const messageText = `
🎯 *New Trip Booking Received\\!*

🆔 *Trip ID:* ${bookingData.tripId.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
👤 *Name:* ${bookingData.userName.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
📧 *Email:* ${bookingData.userEmail.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
📞 *Phone:* ${bookingData.userPhone.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
👥 *Travelers:* ${bookingData.numTravelers.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
💳 *Payment Method:* ${bookingData.paymentMethodId.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
⏰ *Submitted:* ${bookingData.submittedAt.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}

📸 *Payment Screenshot:* [View Image](${bookingData.screenshotUrl})
    `.trim()

    // Send text message
    const textResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageText,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: false,
      }),
    })

    const textResult = await textResponse.json()

    if (!textResponse.ok) {
      console.error("Telegram API Error:", textResult)

      // For chat not found errors, provide more helpful information
      if (textResult.error_code === 400 && textResult.description?.includes("chat not found")) {
        console.error("Chat not found. Make sure the bot has been started and the chat ID is correct.")
        return {
          success: false,
          error: "Telegram chat not found. Please check your TELEGRAM_CHAT_ID configuration.",
          isSilentError: true, // Don't fail the booking for this error
        }
      }

      return {
        success: false,
        error: textResult.description || "Unknown Telegram error",
        isSilentError: true, // Don't fail the booking for Telegram errors
      }
    }

    // Send screenshot as photo
    try {
      const photoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          photo: bookingData.screenshotUrl,
          caption: `💳 Payment screenshot from ${bookingData.userName}'s booking`,
        }),
      })

      if (!photoResponse.ok) {
        console.error("Photo send failed:", await photoResponse.json())
      }
    } catch (photoError) {
      console.error("Photo send error:", photoError)
    }

    return { success: true }
  } catch (error) {
    console.error("Telegram send error:", error)
    return {
      success: false,
      error: "Network error",
      isSilentError: true, // Don't fail the booking for network errors
    }
  }
}

// Update the createBookingAction function to handle Telegram errors gracefully
export async function createBookingAction(formData: FormData) {
  try {
    // Extract form data
    const tripId = formData.get("tripId") as string
    const userName = formData.get("userName") as string
    const userEmail = formData.get("userEmail") as string
    const userPhone = formData.get("userPhone") as string
    const numTravelers = formData.get("numTravelers") as string
    const paymentMethodId = formData.get("paymentMethodId") as string
    const paymentScreenshot = formData.get("paymentScreenshot") as File

    // Validate required fields
    if (!tripId || !userName || !userEmail || !numTravelers || !paymentMethodId) {
      return { success: false, message: "Please fill all required fields" }
    }

    if (!paymentScreenshot) {
      return { success: false, message: "Please upload payment screenshot" }
    }

    // Upload screenshot to Vercel Blob
    const blob = await put(`bookings/${Date.now()}-${paymentScreenshot.name}`, paymentScreenshot, {
      access: "public",
    })

    // Prepare booking data
    const bookingData = {
      tripId,
      userName,
      userEmail,
      userPhone: userPhone || "Not provided",
      numTravelers,
      paymentMethodId,
      screenshotUrl: blob.url,
      submittedAt: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "short",
      }),
    }

    // Send to Telegram
    const telegramResult = await sendBookingToTelegram(bookingData)

    // If Telegram notification failed but it's a silent error, still proceed with booking
    if (!telegramResult.success && !telegramResult.isSilentError) {
      return { success: false, message: "Failed to send booking notification" }
    }

    // If Telegram notification failed but it's a silent error, show a warning
    const telegramWarning = !telegramResult.success
      ? "Note: Admin notification could not be sent, but your booking is confirmed."
      : ""

    return {
      success: true,
      message: `Booking submitted successfully! You will receive confirmation shortly. ${telegramWarning}`,
      telegramStatus: telegramResult.success ? "sent" : "failed",
    }
  } catch (error) {
    console.error("Booking submission error:", error)
    return { success: false, message: "Internal server error. Please try again." }
  }
}
