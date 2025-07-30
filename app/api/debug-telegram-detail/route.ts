import { NextResponse } from "next/server"

export async function GET() {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    const results = {
      credentialsCheck: {
        hasBotToken: !!BOT_TOKEN,
        hasChatId: !!CHAT_ID,
        botTokenLength: BOT_TOKEN?.length || 0,
        chatIdValue: CHAT_ID || "not set",
      },
      placeholderCheck: {
        isBotTokenPlaceholder: BOT_TOKEN === "your_bot_token_here" || BOT_TOKEN === "your_telegram_bot_token_here",
        isChatIdPlaceholder: CHAT_ID === "your_personal_chat_id_here" || CHAT_ID === "your_chat_id_here",
      },
      formatCheck: {
        isChatIdValidFormat: CHAT_ID ? /^-?\d+$/.test(CHAT_ID) : false,
        chatIdFormat: CHAT_ID ? (CHAT_ID.startsWith("-") ? "Group/Channel" : "Personal") : "Invalid",
      },
      botApiTest: null as any,
      chatTest: null as any,
    }

    // Test 4: Bot API Connection
    if (BOT_TOKEN && BOT_TOKEN !== "your_bot_token_here" && BOT_TOKEN !== "your_telegram_bot_token_here") {
      try {
        const botResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
        const botResult = await botResponse.json()

        results.botApiTest = {
          success: botResponse.ok,
          botInfo: botResult.ok ? botResult.result : null,
          error: botResult.ok ? null : botResult.description,
        }
      } catch (error) {
        results.botApiTest = {
          success: false,
          error: "Network error connecting to Telegram API",
        }
      }
    } else {
      results.botApiTest = {
        success: false,
        error: "Bot token not configured or using placeholder",
      }
    }

    // Test 5: Chat Accessibility
    if (
      BOT_TOKEN &&
      CHAT_ID &&
      BOT_TOKEN !== "your_bot_token_here" &&
      CHAT_ID !== "your_personal_chat_id_here" &&
      /^-?\d+$/.test(CHAT_ID)
    ) {
      try {
        const chatResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
          }),
        })

        const chatResult = await chatResponse.json()

        results.chatTest = {
          success: chatResponse.ok,
          chatInfo: chatResult.ok ? chatResult.result : null,
          error: chatResult.ok ? null : chatResult.description,
          errorCode: chatResult.error_code || null,
        }
      } catch (error) {
        results.chatTest = {
          success: false,
          error: "Network error testing chat access",
        }
      }
    } else {
      results.chatTest = {
        success: false,
        error: "Prerequisites not met for chat test",
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
