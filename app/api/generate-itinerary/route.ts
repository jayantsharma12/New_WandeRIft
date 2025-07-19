import { type NextRequest, NextResponse } from "next/server"

<<<<<<< HEAD
// Enhanced JSON parsing function
function parseAIResponse(rawResponse: string) {
  try {
    // Step 1: Remove markdown code blocks and clean basic formatting
    let cleanText = rawResponse
      .trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/`/g, "")
    
    // Step 2: Remove comments
    cleanText = cleanText
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
    
    // Step 3: Find the JSON object boundaries
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
    }
    
    // Step 4: Fix common JSON formatting issues
    cleanText = cleanText
      // Fix unquoted property names
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      // Fix trailing commas before closing braces/brackets
      .replace(/,(\s*[}\]])/g, '$1')
      // Fix missing commas after numbers followed by quotes
      .replace(/(\d+)\s*\n\s*"/g, '$1,\n"')
      .replace(/(\d+)\s+"/g, '$1, "')
      // Fix missing commas after quoted strings followed by quotes
      .replace(/"\s*\n\s*"/g, '",\n"')
      // Remove any trailing notes or explanations
      .replace(/\*\*Note:\*\*.*$/s, '')
      .replace(/Note:.*$/s, '')
      // Normalize whitespace but preserve structure
      .replace(/\s+/g, ' ')
      .trim();

    return JSON.parse(cleanText);
    
  } catch (error) {
    console.error("Enhanced parsing failed:", error);
    console.error("Cleaned text snippet around error:", cleanText?.substring(Math.max(0, 3400), 3600));
    throw error;
  }
}

=======
>>>>>>> 14e9023 (completed with Authication)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, days, budget, interests, travelers } = body

    if (!destination || !days || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if Google Gemini API key is available
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

    try {
      // Use Google Gemini API
      const { GoogleGenerativeAI } = await import("@google/generative-ai")
      const genAI = new GoogleGenerativeAI(apiKey)

      const prompt = `Create a detailed ${days}-day educational mountain adventure itinerary for ${destination}, India with a ${budget} budget for ${travelers || 1} student travelers.

Focus on authentic experiences and educational activities. The travelers are interested in: ${interests.join(", ")}.

<<<<<<< HEAD
IMPORTANT: Return ONLY valid JSON, no markdown blocks, no explanations, no notes.

=======
>>>>>>> 14e9023 (completed with Authication)
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

<<<<<<< HEAD
Return ONLY this JSON structure with no additional text:
=======
Format as JSON with this exact structure:
>>>>>>> 14e9023 (completed with Authication)
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

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

<<<<<<< HEAD
      console.log("Raw AI Response:", text.substring(0, 500) + "...")

      // Parse the JSON response with enhanced handling
      let parsedResponse
      try {
        // Use the enhanced parsing function first
        parsedResponse = parseAIResponse(text)
      } catch (enhancedParseError) {
        console.error("Enhanced parsing failed, trying fallback:", enhancedParseError)
        
        // Fallback to your original parsing logic
        try {
          let cleanText = text.trim()
          cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?/g, "")
          cleanText = cleanText.replace(/`/g, "")
          cleanText = cleanText.replace(/\/\/.*$/gm, "")
          cleanText = cleanText.replace(/\/\*[\s\S]*?\*\//g, "")
          cleanText = cleanText.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
          cleanText = cleanText.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
          cleanText = cleanText.replace(/,\s*([}\]])/g, "$1")

          parsedResponse = JSON.parse(cleanText)
        } catch (fallbackParseError) {
          console.error("Fallback parsing also failed:", fallbackParseError)
          console.error("Raw response snippet:", text.substring(0, 1000))

          // Try regex extraction as last resort
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
=======
      // Parse the JSON response with improved handling
      let parsedResponse
      try {
        // Clean the response text to remove markdown code blocks and comments
        let cleanText = text.trim()

        // Remove markdown code blocks if present (e.g., \`\`\`json ... \`\`\`)
        cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?/g, "")

        // Remove any remaining markdown backticks
        cleanText = cleanText.replace(/`/g, "")

        // Remove single-line comments (// ...)
        cleanText = cleanText.replace(/\/\/.*$/gm, "")

        // Remove multi-line comments (/* ... */)
        cleanText = cleanText.replace(/\/\*[\s\S]*?\*\//g, "")

        // Remove newlines and normalize whitespace
        cleanText = cleanText.replace(/\n/g, " ").replace(/\s+/g, " ").trim()

        // Attempt to fix common JSON formatting issues (e.g., unquoted keys, trailing commas)
        // This regex attempts to add quotes to unquoted keys. It's a common issue.
        cleanText = cleanText.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        // This regex attempts to remove trailing commas before closing braces/brackets.
        cleanText = cleanText.replace(/,\s*([}\]])/g, "$1")

        // Try to parse the cleaned text directly first
        try {
          parsedResponse = JSON.parse(cleanText)
        } catch (directParseError) {
          console.error("Direct parsing failed:", directParseError)
          console.error("Cleaned text snippet:", cleanText.substring(0, 500))

          // If direct parsing fails, try to extract JSON using regex
          const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
              parsedResponse = JSON.parse(jsonMatch[0])
            } catch (regexParseError) {
              console.error("Regex parsing also failed:", regexParseError)
              // Try to fix the extracted JSON
>>>>>>> 14e9023 (completed with Authication)
              const fixedJson = jsonMatch[0]
                .replace(/,\s*}/g, "}")
                .replace(/,\s*]/g, "]")
                .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')

              parsedResponse = JSON.parse(fixedJson)
<<<<<<< HEAD
            } catch (regexParseError) {
              console.error("Regex parsing failed:", regexParseError)
              throw new Error("All parsing methods failed")
            }
          } else {
            throw new Error("No JSON found in response")
          }
        }
      }

      // Validate the response structure
      if (!parsedResponse.itinerary || !Array.isArray(parsedResponse.itinerary)) {
        console.error("Invalid structure, attempting regeneration...")
        
        // Try regeneration with stricter prompt
        const strictPrompt = `Generate ONLY valid JSON for a ${days}-day itinerary for ${destination}. No text before or after JSON. Use this exact format:
{"itinerary":[{"day":1,"theme":"Day theme","activities":[{"time":"7:00 AM","activity":"Activity description","educational_value":"Learning outcome","cost":200,"duration":"2 hours"}]}],"total_estimated_cost":5000,"educational_highlights":["Highlight 1"],"cultural_insights":["Insight 1"],"recommended_reading":["Book 1"]}`

        const strictResult = await model.generateContent(strictPrompt)
        const strictResponse = await strictResult.response
        const strictText = strictResponse.text()

        try {
          parsedResponse = parseAIResponse(strictText)
          
          if (!parsedResponse.itinerary || !Array.isArray(parsedResponse.itinerary)) {
            throw new Error("Regenerated response also has invalid structure")
          }
        } catch (strictError) {
          console.error("Strict regeneration failed:", strictError)
=======
            }
          } else {
            throw new Error("No valid JSON found in AI response")
          }
        }

        // Validate the response structure
        if (!parsedResponse.itinerary || !Array.isArray(parsedResponse.itinerary)) {
          throw new Error("Invalid itinerary structure in AI response")
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError)
        console.error("Raw response:", text) // Log raw response for debugging

        // If parsing completely fails, try to regenerate with stricter prompt
        console.log("Attempting to regenerate with stricter JSON format...")

        try {
          const strictPrompt = `Generate ONLY valid JSON for a ${days}-day itinerary for ${destination}. No markdown, no text outside JSON. Use this exact format:
{"itinerary":[{"day":1,"theme":"Day theme","activities":[{"time":"7:00 AM","activity":"Activity description","educational_value":"Learning outcome","cost":200,"duration":"2 hours"}]}],"total_estimated_cost":5000,"educational_highlights":["Highlight 1","Highlight 2"],"cultural_insights":["Insight 1","Insight 2"],"recommended_reading":["Book 1","Book 2"]}`

          const strictResult = await model.generateContent(strictPrompt)
          const strictResponse = await strictResult.response
          const strictText = strictResponse.text()

          // Try parsing the strict response
          const strictCleanText = strictText
            .trim()
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]")

          parsedResponse = JSON.parse(strictCleanText)
        } catch (strictError) {
          console.error("Strict regeneration also failed:", strictError)
>>>>>>> 14e9023 (completed with Authication)
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
<<<<<<< HEAD

=======
>>>>>>> 14e9023 (completed with Authication)
    } catch (apiError: any) {
      console.error("Google Gemini API Error:", apiError.message)
      return NextResponse.json(
        {
          error: `AI service error: ${apiError.message}. Please check your API key and try again.`,
          success: false,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return NextResponse.json(
      {
        error: "Failed to generate itinerary. Please try again.",
        success: false,
      },
      { status: 500 },
    )
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 14e9023 (completed with Authication)
