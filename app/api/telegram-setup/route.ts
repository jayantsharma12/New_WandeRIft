import { NextResponse } from "next/server"

export async function GET() {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

    if (!BOT_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: "TELEGRAM_BOT_TOKEN not found in environment variables",
        },
        { status: 400 },
      )
    }

    // Get updates to find chat IDs
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`)
    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result.description || "Failed to get updates",
        },
        { status: 400 },
      )
    }

    // Extract unique chat IDs from updates
    const chatIds = new Set()
    const chats: { id: any; type: any; title: any; username: any }[] = []

    result.result.forEach((update: any) => {
      if (update.message?.chat) {
        const chat = update.message.chat
        if (!chatIds.has(chat.id)) {
          chatIds.add(chat.id)
          chats.push({
            id: chat.id,
            type: chat.type,
            title: chat.title || `${chat.first_name || ""} ${chat.last_name || ""}`.trim(),
            username: chat.username,
          })
        }
      }
    })

    return NextResponse.json({
      success: true,
      chats,
      instructions: "Send a message to your bot first, then refresh this page to see available chat IDs",
      botToken: BOT_TOKEN.substring(0, 5) + "..." + BOT_TOKEN.substring(BOT_TOKEN.length - 5),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      },
      { status: 500 },
    )
  }
}
