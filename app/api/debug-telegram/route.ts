import { NextResponse } from "next/server"

export async function GET() {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    // Check environment variables
    const envCheck = {
      hasBotToken: !!BOT_TOKEN,
      hasChatId: !!CHAT_ID,
      botTokenLength: BOT_TOKEN?.length || 0,
      chatIdValue: CHAT_ID || "not set",
      botTokenFormat: BOT_TOKEN ? /^\d+:[A-Za-z0-9_-]{35}$/.test(BOT_TOKEN) : false,
      chatIdFormat: CHAT_ID ? /^-?\d+$/.test(CHAT_ID) : false,
    }

    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json({
        success: false,
        error: "Missing environment variables",
        debug: envCheck,
      })
    }

    // Test bot info
    const botInfoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
    const botInfo = await botInfoResponse.json()

    if (!botInfoResponse.ok) {
      return NextResponse.json({
        success: false,
        error: "Bot token invalid",
        debug: { ...envCheck, botError: botInfo },
      })
    }

    // Test sending a message
    const testMessage = `🧪 Debug Test Message
    
Time: ${new Date().toLocaleString()}
Bot ID: ${botInfo.result.id}
Chat ID: ${CHAT_ID}
    
If you see this message, the bot is working correctly!`

    const messageResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: testMessage,
      }),
    })

    const messageResult = await messageResponse.json()

    return NextResponse.json({
      success: messageResponse.ok,
      debug: {
        ...envCheck,
        botInfo: botInfo.result,
        messageResult,
        testSent: messageResponse.ok,
      },
      error: messageResponse.ok ? null : messageResult.description,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
