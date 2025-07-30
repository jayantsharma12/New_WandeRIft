import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "API key is required",
        },
        { status: 400 },
      )
    }

    // Test the API key with a simple request
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent("Say hello in one word")
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      model: "gemini-1.5-flash",
      testResponse: text,
      message: "API key is valid and working!",
    })
  } catch (error: any) {
    console.error("Gemini API test error:", error)

    let errorMessage = "Unknown error occurred"

    if (error.message?.includes("API key not valid")) {
      errorMessage = "API key is invalid. Please check your API key and try again."
    } else if (error.message?.includes("quota")) {
      errorMessage = "API quota exceeded. Please wait and try again or upgrade your plan."
    } else if (error.message?.includes("permission")) {
      errorMessage = "Permission denied. Make sure the API is enabled in your Google Cloud project."
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error.message,
      },
      { status: 400 },
    )
  }
}
