import { NextResponse } from "next/server"

export async function GET() {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    const config = {
      hasBotToken: !!BOT_TOKEN && BOT_TOKEN !== "your_bot_token_here",
      hasChatId: !!CHAT_ID && CHAT_ID !== "your_personal_chat_id_here" && CHAT_ID !== "your_chat_id_here",
      botTokenValid: BOT_TOKEN ? /^\d+:[A-Za-z0-9_-]{35}$/.test(BOT_TOKEN) : false,
      chatIdValid: CHAT_ID ? /^-?\d+$/.test(CHAT_ID) : false,
      isConfigured: false,
    }

    config.isConfigured = config.hasBotToken && config.hasChatId && config.botTokenValid && config.chatIdValid

    return NextResponse.json({
      success: true,
      config,
      recommendations: {
        needsBotToken: !config.hasBotToken,
        needsChatId: !config.hasChatId,
        needsValidBotToken: config.hasBotToken && !config.botTokenValid,
        needsValidChatId: config.hasChatId && !config.chatIdValid,
      },
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
