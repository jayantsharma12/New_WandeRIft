import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { getTrips, getAllReviews, type Trip, type Review } from "@/lib/data"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Invalid message format" }, { status: 400 })
    }

    // Query the database for relevant trip data
    const tripData = await queryTripData(message)

    // Try to generate response using Gemini API first
    let response: string

    try {
      if (process.env.GOOGLE_GEMINI_API_KEY) {
        response = await generateGeminiResponse(message, tripData)
      } else {
        throw new Error("Gemini API key not available")
      }
    } catch (geminiError) {
      console.warn("Gemini API failed, using fallback:", geminiError)
      // Fallback to rule-based system if Gemini fails
      response = await generateTravelResponse(message, tripData)
    }

    return Response.json({ response })
  } catch (error) {
    console.error("AI Chat Error:", error)

    // Provide a helpful fallback response
    const fallbackResponse =
      "I'm here to help you explore amazing travel destinations! Ask me about our trips to Tokyo, Bali, Paris, or Machu Picchu. I can help you find budget-friendly options, luxury experiences, or anything in between. What kind of adventure are you looking for?"

    return Response.json({ response: fallbackResponse })
  }
}

async function generateGeminiResponse(message: string, tripData: any): Promise<string> {
  const { trips, reviews, query_type, destinations, database_status } = tripData

  const systemPrompt = `You are WanderRift's travel assistant. Give direct, concise answers based on what the user specifically asks for.

AVAILABLE TRIP DATA:
${JSON.stringify(tripData, null, 2)}

RESPONSE RULES:
1. If user asks "how many trips" or "how many destinations" - ONLY list destination names, nothing else
2. If user asks for "cheapest" or "budget" - Show only budget trips with prices
3. If user asks for "luxury" - Show only luxury options
4. If user asks about specific destination - Give details about that destination only
5. If user asks for "reviews" - Show only reviews
6. If user asks general questions - Give brief helpful response

FORMATTING:
- Use ₹ for prices (e.g., ₹25,000)
- Use ⭐ for ratings
- Be direct and to the point
- No extra fluff or marketing language unless specifically asked for details

EXAMPLES:
User: "How many destinations do you have?"
Response: "Manali Kasol, Rishikesh, Shimla, Kasol, Spiti Valley, Mcleodganj"

User: "Show me budget trips"
Response: "• Rishikesh - 4 days, ₹3,400 ⭐ 4.2/5
• Kasol - 7 days, ₹6,700 ⭐ 4.6/5"

User: "Tell me about Manali"
Response: "Manali Kasol - 5 days, Moderate budget, ₹6,500 ⭐ 4.5/5
[Include activities and details]"

Be direct and answer exactly what is asked.`

  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    system: systemPrompt,
    prompt: message,
    maxTokens: 300,
    temperature: 0.3,
  })

  return text
}

// Fallback rule-based system with direct responses
async function generateTravelResponse(message: string, tripData: any): Promise<string> {
  const lowerMessage = message.toLowerCase()
  const { trips, reviews, query_type, destinations } = tripData

  // Handle direct questions with specific responses
  if (lowerMessage.includes("how many") && (lowerMessage.includes("trip") || lowerMessage.includes("destination"))) {
    return destinations.join(", ")
  }

  if (lowerMessage.includes("destination") && !lowerMessage.includes("about") && !lowerMessage.includes("tell")) {
    return destinations.join(", ")
  }

  // Handle different types of queries with direct responses
  switch (query_type) {
    case "destinations":
      return destinations.join(", ")

    case "pricing":
    case "budget":
      return generateDirectBudgetResponse(trips, lowerMessage)

    case "luxury":
      return generateDirectLuxuryResponse(trips)

    case "popular":
    case "rated":
      return generateDirectPopularResponse(trips)

    case "reviews":
      return generateDirectReviewsResponse(reviews)

    default:
      return generateDirectGeneralResponse(message, trips, lowerMessage)
  }
}

function generateDirectBudgetResponse(trips: Trip[], message: string): string {
  const budgetTrips = trips.filter((trip) => trip.budget === "Budget").slice(0, 5)

  if (budgetTrips.length === 0) {
    return "No budget trips available currently."
  }

  return budgetTrips
    .map(
      (trip) => `• ${trip.destination} - ${trip.days} days, ₹${trip.cost.toLocaleString("en-IN")} ⭐ ${trip.rating}/5`,
    )
    .join("\n")
}

function generateDirectLuxuryResponse(trips: Trip[]): string {
  const luxuryTrips = trips.filter((trip) => trip.budget === "Luxury").slice(0, 5)

  if (luxuryTrips.length === 0) {
    return "No luxury trips available currently."
  }

  return luxuryTrips
    .map(
      (trip) => `• ${trip.destination} - ${trip.days} days, ₹${trip.cost.toLocaleString("en-IN")} ⭐ ${trip.rating}/5`,
    )
    .join("\n")
}

function generateDirectPopularResponse(trips: Trip[]): string {
  const topRated = trips.sort((a, b) => b.rating - a.rating).slice(0, 5)

  return topRated
    .map(
      (trip) => `• ${trip.destination} - ⭐ ${trip.rating}/5, ${trip.days} days, ₹${trip.cost.toLocaleString("en-IN")}`,
    )
    .join("\n")
}

function generateDirectReviewsResponse(reviews: any[]): string {
  if (reviews.length === 0) {
    return "No reviews available currently."
  }

  return reviews
    .slice(0, 3)
    .map((review) => `${review.user_name} - ${review.destination} ⭐ ${review.rating}/5: "${review.comment}"`)
    .join("\n\n")
}

function generateDirectGeneralResponse(message: string, trips: Trip[], lowerMessage: string): string {
  // Handle specific destination queries
  const destinationMatch = lowerMessage.match(/(?:to|in|visit|about)\s+([a-zA-Z\s,]+?)(?:\s|$|[?!.])/i)
  if (destinationMatch) {
    const searchDestination = destinationMatch[1].trim()
    const matchingTrips = trips.filter((trip) =>
      trip.destination.toLowerCase().includes(searchDestination.toLowerCase()),
    )

    if (matchingTrips.length > 0) {
      const trip = matchingTrips[0]
      return `${trip.destination} - ${trip.days} days, ${trip.budget} budget, ₹${trip.cost.toLocaleString("en-IN")} ⭐ ${trip.rating}/5

Activities: ${trip.interests.join(", ")}
Available seats: ${(trip.total_seats || 20) - (trip.booked_seats || 0)}`
    } else {
      return `No trips available to ${searchDestination}`
    }
  }

  // Handle price queries
  if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
    return trips
      .slice(0, 5)
      .map((trip) => `${trip.destination}: ₹${trip.cost.toLocaleString("en-IN")}`)
      .join("\n")
  }

  // Handle greeting
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hi! I can help you with trip information. Ask me about destinations, prices, or specific places."
  }

  // Default - show available destinations
  return trips
    .slice(0, 6)
    .map((trip) => trip.destination)
    .join(", ")
}

async function queryTripData(message: string) {
  const lowerMessage = message.toLowerCase()

  try {
    let trips: Trip[] = []
    let reviews: (Review & { destination: string; tripDays: number; tripBudget: string })[] = []

    // Get all trips (will use fallback data if database fails)
    const allTrips = await getTrips()

    // Filter and sort based on user query
    if (lowerMessage.includes("cheap") || lowerMessage.includes("budget")) {
      trips = allTrips
        .filter((trip) => trip.budget === "Budget")
        .sort((a, b) => a.cost - b.cost)
        .slice(0, 5)
    } else if (lowerMessage.includes("expensive") || lowerMessage.includes("luxury")) {
      trips = allTrips
        .filter((trip) => trip.budget === "Luxury")
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 5)
    } else if (lowerMessage.includes("rated") || lowerMessage.includes("best")) {
      trips = allTrips.sort((a, b) => b.rating - a.rating).slice(0, 5)
    } else if (lowerMessage.includes("moderate")) {
      trips = allTrips.filter((trip) => trip.budget === "Moderate").slice(0, 5)
    } else if (lowerMessage.includes("destination")) {
      trips = allTrips.slice(0, 10)
    } else {
      trips = allTrips.slice(0, 8)
    }

    // Get reviews if mentioned
    if (lowerMessage.includes("review")) {
      reviews = await getAllReviews()
      reviews = reviews.slice(0, 5)
    }

    // Handle specific destination queries
    const destinationMatch = lowerMessage.match(/(?:to|in|visit|about)\s+([a-zA-Z\s,]+?)(?:\s|$|[?!.])/i)
    if (destinationMatch) {
      const searchDestination = destinationMatch[1].trim()
      trips = allTrips.filter((trip) => trip.destination.toLowerCase().includes(searchDestination.toLowerCase()))
    }

    return {
      trips,
      reviews,
      query_type: determineQueryType(lowerMessage),
      total_trips: allTrips.length,
      destinations: [...new Set(allTrips.map((trip) => trip.destination))],
      database_status: "connected",
    }
  } catch (error) {
    console.error("Database query error:", error)
    return {
      trips: [],
      reviews: [],
      error: "Database connection failed",
      query_type: "error",
      database_status: "failed",
    }
  }
}

function determineQueryType(message: string) {
  if (message.includes("destination")) return "destinations"
  if (
    message.includes("price") ||
    message.includes("cost") ||
    message.includes("cheap") ||
    message.includes("expensive")
  )
    return "pricing"
  if (message.includes("review")) return "reviews"
  if (message.includes("popular") || message.includes("rated") || message.includes("best")) return "popular"
  if (message.includes("budget")) return "budget"
  if (message.includes("luxury")) return "luxury"
  if (message.includes("moderate")) return "moderate"
  return "general"
}
