import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      console.log(`Attempt ${attempt + 1} failed:`, error.message)
      
      // Don't retry on certain errors
      if (error.message?.includes("API_KEY_INVALID") || 
          error.message?.includes("API key expired") ||
          error.message?.includes("PERMISSION_DENIED")) {
        throw error
      }

      // If this is the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        console.log(`All ${maxRetries} attempts failed`)
        throw error
      }

      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      console.log(`Retrying in ${Math.round(delay)}ms... (Attempt ${attempt + 1}/${maxRetries})`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, days, budget, interests, travelers } = body

    console.log(`Generating itinerary for ${destination}, ${days} days, ${budget} budget, ${travelers || 1} travelers`)

    // Validate required fields
    if (!destination || !days || !budget) {
      return NextResponse.json({ 
        error: "Missing required fields: destination, days, and budget are required" 
      }, { status: 400 })
    }

    // Validate API key
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey || apiKey === "your_google_gemini_api_key_here" || apiKey.trim() === "") {
      return NextResponse.json(
        {
          error: "Google Gemini API key not configured. Please add GOOGLE_GEMINI_API_KEY to your environment variables.",
          success: false,
        },
        { status: 500 },
      )
    }

    // Validate input ranges
    const numDays = Number(days)
    const numTravelers = Number(travelers) || 1

    if (numDays < 1 || numDays > 30) {
      return NextResponse.json({ 
        error: "Days must be between 1 and 30" 
      }, { status: 400 })
    }

    if (numTravelers < 1 || numTravelers > 20) {
      return NextResponse.json({ 
        error: "Number of travelers must be between 1 and 20" 
      }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    })

    const basePrompt = `Create a detailed ${numDays}-day educational mountain adventure itinerary for ${destination}, India with a ${budget} budget for ${numTravelers} student travelers.

Focus on authentic experiences and educational activities. The travelers are interested in: ${interests?.join(", ") || "general exploration"}.

For each day, provide:
- A meaningful theme that captures the day's focus
- 5-7 activities with specific times (starting from early morning)
- Each activity should include: exact time, detailed description, educational value, estimated cost in Indian Rupees, and duration
- Activities should be realistic and location-specific to ${destination}
- Include authentic local experiences, cultural learning, and adventure activities
- Costs should be student-friendly and realistic for ${budget} budget
- Include meals, transportation, and entry fees in activities

Also provide:
- Total estimated cost for the entire trip
- 5 key educational highlights specific to ${destination}
- 5 cultural insights about the region
- 3 recommended books/resources about ${destination}

**CRITICAL:** Your response MUST be valid JSON only. No markdown, no code blocks, no extra text. Start with { and end with }.

Format as JSON with this exact structure:
{
  "itinerary": [
    {
      "day": 1,
      "theme": "Specific theme for the day",
      "activities": [
        {
          "time": "6:00 AM",
          "activity": "Detailed activity description",
          "educational_value": "What will be learned",
          "cost": 500,
          "duration": "2 hours"
        }
      ]
    }
  ],
  "total_estimated_cost": 15000,
  "educational_highlights": ["Specific learning points about ${destination}"],
  "cultural_insights": ["Specific cultural information about ${destination}"],
  "recommended_reading": ["Specific books about ${destination}"]
}`

    let parsedResponse
    let rawText = ""
    let cleanedText = ""

    try {
      // Use retry logic for the API call
      const result = await retryWithBackoff(async () => {
        return await model.generateContent(basePrompt)
      }, 3, 3000) // 3 retries, starting with 3 second delay

      rawText = result.response.text()

      // More robust cleaning of the response
      cleanedText = rawText.trim()
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.substring("```json".length)
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.substring("```".length)
      }
      
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.substring(0, cleanedText.length - "```".length)
      }
      
      cleanedText = cleanedText.trim()

      // Find JSON boundaries more reliably
      const firstBrace = cleanedText.indexOf('{')
      const lastBrace = cleanedText.lastIndexOf('}')
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedText = cleanedText.substring(firstBrace, lastBrace + 1)
      }

      // Attempt to parse the cleaned JSON
      parsedResponse = JSON.parse(cleanedText)

      // Validate the response structure
      if (!parsedResponse.itinerary || !Array.isArray(parsedResponse.itinerary)) {
        throw new Error("Invalid itinerary structure: missing or invalid itinerary array")
      }

      if (parsedResponse.itinerary.length === 0) {
        throw new Error("Empty itinerary generated")
      }

      // Validate each day has required fields
      for (const day of parsedResponse.itinerary) {
        if (!day.day || !day.theme || !day.activities || !Array.isArray(day.activities)) {
          throw new Error(`Invalid day structure for day ${day.day || 'unknown'}`)
        }
      }

      console.log(`Successfully generated itinerary with ${parsedResponse.itinerary.length} days`)

    } catch (parseError: any) {
      console.error("Failed to parse AI response:", parseError.message)
      
      // Log first 500 chars for debugging (avoid logging huge responses)
      if (rawText) {
        console.error("Raw AI response:", rawText.substring(0, 200) + (rawText.length > 200 ? "..." : ""))
      }
      if (cleanedText) {
        console.error("Cleaned text:", cleanedText.substring(0, 200) + (cleanedText.length > 200 ? "..." : ""))
      }

      // Handle specific API errors
      if (parseError.message?.includes("API key expired") || parseError.message?.includes("API_KEY_INVALID")) {
        return NextResponse.json(
          {
            error: "API key has expired. Please renew your Google Gemini API key.",
            success: false,
          },
          { status: 401 },
        )
      }

      if (parseError.message?.includes("quota exceeded") || parseError.message?.includes("RATE_LIMIT_EXCEEDED")) {
        return NextResponse.json(
          {
            error: "API quota exceeded. Please try again later or check your API usage limits.",
            success: false,
          },
          { status: 429 },
        )
      }

      if (parseError.message?.includes("overloaded") || parseError.message?.includes("503")) {
        return NextResponse.json(
          {
            error: "The AI service is currently overloaded. Please try again in a few minutes.",
            success: false,
            retryAfter: 60,
          },
          { status: 503 },
        )
      }

      return NextResponse.json(
        {
          error: "Failed to generate valid itinerary. Please try again.",
          success: false,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: parsedResponse,
      destination,
      days: numDays,
      budget,
      interests: interests || [],
      travelers: numTravelers,
    })

  } catch (error: any) {
    console.error("Error in generate-itinerary route handler:", error)
    
    // Handle overloaded service
    if (error.message?.includes("overloaded") || error.message?.includes("503")) {
      return NextResponse.json(
        {
          error: "The AI service is currently experiencing high traffic. Please try again in a few minutes.",
          success: false,
          retryAfter: 120,
        },
        { status: 503 },
      )
    }

    // Handle network errors
    if (error.message?.includes("fetch")) {
      return NextResponse.json(
        {
          error: "Network error occurred. Please check your internet connection and try again.",
          success: false,
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        error: `An unexpected error occurred: ${error.message || "Please try again."}`,
        success: false,
      },
      { status: 500 },
    )
  }
}