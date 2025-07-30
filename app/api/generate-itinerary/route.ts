import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, days, budget, interests, travelers } = body

    if (!destination || !days || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey || apiKey === "your_google_gemini_api_key_here") {
      return NextResponse.json(
        {
          error:
            "Google Gemini API key not configured. Please add GOOGLE_GEMINI_API_KEY to your environment variables.",
          success: false,
        },
        { status: 400 },
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const basePrompt = `Create a detailed ${days}-day educational mountain adventure itinerary for ${destination}, India with a ${budget} budget for ${travelers || 1} student travelers.

Focus on authentic experiences and educational activities. The travelers are interested in: ${interests.join(", ")}.

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

**IMPORTANT:** Your entire response MUST be a single, valid JSON object. Do NOT include any text, markdown fences (like \`\`\`json), or comments outside the JSON. Ensure all string values are properly quoted and any internal quotes are escaped (e.g., "It's a great day" should be "It\\'s a great day"). Newlines within string values must be escaped as \\n. Ensure all commas are correctly placed between elements and properties.

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
      const result = await model.generateContent(basePrompt)
      rawText = result.response.text()

      // Clean the raw text: remove markdown fences and trim
      cleanedText = rawText.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.substring("```json".length)
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.substring(0, cleanedText.length - "```".length)
      }
      cleanedText = cleanedText.trim() // Trim again after removing fences

      // Attempt to parse the cleaned JSON
      parsedResponse = JSON.parse(cleanedText)

      // Validate the response structure
      if (!parsedResponse.itinerary || !Array.isArray(parsedResponse.itinerary)) {
        throw new Error("Invalid itinerary structure in AI response after parsing.")
      }
    } catch (parseError: any) {
      console.error("Failed to parse AI response:", parseError)
      console.error("Raw AI response (for debugging):", rawText)
      // Ensure cleanedText is defined before logging it
      const cleanedTextForLog = cleanedText !== "undefined" ? cleanedText : "N/A (parsing failed before cleaning)"
      console.error("Cleaned text attempted to parse (for debugging):", cleanedTextForLog)

      return NextResponse.json(
        {
          error: "Failed to generate valid itinerary. The AI response was malformed. Please try again.",
          success: false,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: parsedResponse,
      destination,
      days,
      budget,
      interests,
      travelers,
    })
  } catch (error: any) {
    console.error("Error in generate-itinerary route handler:", error)
    return NextResponse.json(
      {
        error: `An unexpected error occurred: ${error.message || "Please try again."}`,
        success: false,
      },
      { status: 500 },
    )
  }
}
