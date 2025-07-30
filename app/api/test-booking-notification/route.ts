import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    console.log("=== BOOKING NOTIFICATION TEST ===")
    console.log("Bot Token exists:", !!BOT_TOKEN)
    console.log("Chat ID exists:", !!CHAT_ID)
    console.log("Bot Token length:", BOT_TOKEN?.length || 0)
    console.log("Chat ID value:", CHAT_ID)
    console.log("Booking data:", bookingData)

    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json({
        success: false,
        error: "Missing environment variables",
        details: {
          hasBotToken: !!BOT_TOKEN,
          hasChatId: !!CHAT_ID,
          chatIdValue: CHAT_ID || "not set",
        },
      })
    }

    // Format the exact message that would be sent for a booking
    const messageText = `
🎯 *New Trip Booking Received\\!*

🆔 *Trip ID:* ${bookingData.tripId.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
👤 *Name:* ${bookingData.userName.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
📧 *Email:* ${bookingData.userEmail.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
📞 *Phone:* ${bookingData.userPhone.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
👥 *Travelers:* ${bookingData.numTravelers.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
💳 *Payment Method:* ${bookingData.paymentMethodId.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
⏰ *Submitted:* ${bookingData.submittedAt.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}

📸 *Payment Screenshot:* [View Image](${bookingData.screenshotUrl})

🧪 *This is a test booking notification\\!*
    `.trim()

    console.log("Sending message:", messageText)

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageText,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: false,
      }),
    })

    const result = await response.json()

    console.log("Telegram API response:", result)
    console.log("Response status:", response.status)

    if (!response.ok) {
      console.error("Telegram API Error:", result)
      return NextResponse.json({
        success: false,
        error: result.description || "Unknown Telegram error",
        details: {
          statusCode: response.status,
          telegramError: result,
          botToken: BOT_TOKEN.substring(0, 10) + "...",
          chatId: CHAT_ID,
          messageLength: messageText.length,
        },
      })
    }

    console.log("✅ Message sent successfully!")

    return NextResponse.json({
      success: true,
      message: "Booking notification sent successfully!",
      details: {
        messageId: result.result.message_id,
        chatId: result.result.chat.id,
        sentAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Booking notification test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: {
        errorType: error instanceof Error ? error.constructor.name : "Unknown",
        stack: error instanceof Error ? error.stack : undefined,
      },
    })
  }
}
