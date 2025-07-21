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

**IMPORTANT:** The entire response MUST be a single, valid JSON object. Do NOT include any text or markdown outside the JSON. Ensure all string values are properly quoted and any internal quotes are escaped (e.g., "It's a great day" should be "It\\'s a great day"). Newlines within string values must be escaped as \\n. Ensure all commas are correctly placed between elements and properties.

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

    try {
      const result = await model.generateContent(basePrompt)
      rawText = result.response.text()

      // --- Attempt 1: Minimal Cleaning and Parsing ---
      const cleanTextStage1 = rawText.trim()

      // Extract JSON block first, ensuring it starts with { and ends with }
      let jsonBlock = ""
      const markdownMatch = cleanTextStage1.match(/```json\s*([\s\S]*?)\s*```/)
      if (markdownMatch && markdownMatch[1]) {
        jsonBlock = markdownMatch[1].trim() // Trim extracted content
      } else {
        const firstBrace = cleanTextStage1.indexOf("{")
        const lastBrace = cleanTextStage1.lastIndexOf("}")
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonBlock = cleanTextStage1.substring(firstBrace, lastBrace + 1).trim() // Trim extracted content
        } else {
          throw new Error("No JSON block found in AI response for stage 1.")
        }
      }

      // Remove comments within the extracted block
      jsonBlock = jsonBlock.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")
      // Remove any remaining markdown backticks
      jsonBlock = jsonBlock.replace(/`/g, "")

      try {
        parsedResponse = JSON.parse(jsonBlock)
      } catch (e1) {
        console.warn("Stage 1 parsing failed, attempting stage 2 cleaning:", e1)
        console.log("Raw JSON block for stage 2:", jsonBlock.substring(0, 500) + "...")

        // --- Attempt 2: Aggressive Cleaning and Parsing ---
        let cleanTextStage2 = jsonBlock

        // Remove all newlines and normalize whitespace
        cleanTextStage2 = cleanTextStage2
          .replace(/[\r\n]+/g, "")
          .replace(/\s{2,}/g, " ")
          .trim()

        // Attempt to add quotes to unquoted keys.
        cleanTextStage2 = cleanTextStage2.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        // Attempt to remove trailing commas before closing braces/brackets.
        cleanTextStage2 = cleanTextStage2.replace(/,\s*([}\]])/g, "$1")

        parsedResponse = JSON.parse(cleanTextStage2)
      }

      // Validate the response structure
      if (!parsedResponse.itinerary || !Array.isArray(parsedResponse.itinerary)) {
        throw new Error("Invalid itinerary structure in AI response after parsing.")
      }
    } catch (parseError: any) {
      console.error("Failed to parse AI response after all cleaning attempts:", parseError)
      console.error("Raw AI response:", rawText) // Log raw response for debugging

      // --- Attempt 3: Strict Prompt Regeneration ---
      console.log("Attempting to regenerate with stricter JSON format...")

      try {
        const strictPrompt = `Generate ONLY valid JSON for a ${days}-day itinerary for ${destination}. No markdown, no text outside JSON. Use this exact format:
{"itinerary":[{"day":1,"theme":"Day theme","activities":[{"time":"7:00 AM","activity":"Activity description","educational_value":"Learning outcome","cost":200,"duration":"2 hours"}]}],"total_estimated_cost":5000,"educational_highlights":["Highlight 1","Highlight 2"],"cultural_insights":["Insight 1","Insight 2"],"recommended_reading":["Book 1","Book 2"]}`

        const strictResult = await model.generateContent(strictPrompt)
        const strictText = strictResult.response.text()

        // Minimal cleaning for strict response
        const strictCleanText = strictText
          .trim()
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]")

        parsedResponse = JSON.parse(strictCleanText)
      } catch (strictError: any) {
        console.error("Strict regeneration also failed:", strictError)
        return NextResponse.json(
          {
            error: "Failed to generate valid itinerary. Please try again with different parameters.",
            success: false,
          },
          { status: 500 },
        )
      }
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
