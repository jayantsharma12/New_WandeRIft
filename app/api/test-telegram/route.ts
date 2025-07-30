import { NextResponse } from "next/server"
import { testTelegramConnection, getBotInfo, validateEnvironment } from "@/lib/telegram"

export async function GET() {
  try {
    // First validate environment
    const envValidation = validateEnvironment()

    if (!envValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Environment validation failed",
          issues: envValidation.issues,
          debugInfo: envValidation.debugInfo,
        },
        { status: 400 },
      )
    }

    // Test bot info first
    const botInfo = await getBotInfo()

    if (!botInfo.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Bot token validation failed",
          details: botInfo.error,
          debugInfo: botInfo.debugInfo,
        },
        { status: 400 },
      )
    }

    // Test sending a message
    const testResult = await testTelegramConnection()

    return NextResponse.json({
      success: testResult.success,
      botInfo: botInfo.data,
      testResult: testResult.success ? "Message sent successfully!" : testResult.error,
      error: testResult.success ? null : testResult.error,
      debugInfo: testResult.success ? null : testResult.details,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
