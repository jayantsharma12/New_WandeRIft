interface BookingData {
  name: string
  phone: string
  email: string
  service: string
  date: string
  message: string
  screenshotUrl: string
  submittedAt: string
}

interface BookingDetails {
  tripDestination: string
  userName: string
  userPhone: string
  userEmail: string
  numTravelers: string
  paymentMethod: string
  screenshotUrl?: string
  bookingId?: string
}

// Validate bot token format
function validateBotToken(token: string): boolean {
  const tokenRegex = /^\d+:[A-Za-z0-9_-]{35}$/
  return tokenRegex.test(token)
}

// Extract bot ID from token
function getBotIdFromToken(token: string): string | null {
  const match = token.match(/^(\d+):/)
  return match ? match[1] : null
}

// Validate that chat ID is not the same as bot ID
function validateChatId(chatId: string, botToken: string): { valid: boolean; error?: string } {
  const botId = getBotIdFromToken(botToken)

  if (botId && chatId === botId) {
    return {
      valid: false,
      error: `You're using the bot's own ID (${botId}) as chat ID. You need to use YOUR personal chat ID instead. Please follow the setup instructions to get your personal chat ID.`,
    }
  }

  if (!chatId || chatId === "your_chat_id_here") {
    return {
      valid: false,
      error: "Chat ID is not properly configured. Please use the setup page to find your personal chat ID.",
    }
  }

  return { valid: true }
}

// Legacy function for backward compatibility
export async function sendToTelegram(bookingData: BookingData) {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    console.log("Environment check:", {
      hasToken: !!BOT_TOKEN,
      hasChatId: !!CHAT_ID,
      tokenLength: BOT_TOKEN?.length || 0,
      chatIdValue: CHAT_ID || "not set",
    })

    if (!BOT_TOKEN) {
      return {
        success: false,
        error: "TELEGRAM_BOT_TOKEN is not set in environment variables. Please add it to your .env.local file.",
      }
    }

    if (!CHAT_ID) {
      return {
        success: false,
        error: "TELEGRAM_CHAT_ID is not set in environment variables. Please add it to your .env.local file.",
      }
    }

    // Validate bot token format
    if (!validateBotToken(BOT_TOKEN)) {
      return {
        success: false,
        error: "Invalid bot token format. Bot token should be in format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
      }
    }

    // Validate chat ID
    const chatIdValidation = validateChatId(CHAT_ID, BOT_TOKEN)
    if (!chatIdValidation.valid) {
      return {
        success: false,
        error: chatIdValidation.error,
      }
    }

    const chatId = CHAT_ID.toString().trim()
    const botId = getBotIdFromToken(BOT_TOKEN)

    console.log("Sending to Telegram:", {
      botId,
      chatId,
      isSameBotAndChat: botId === chatId,
      messageLength: bookingData.name.length,
    })

    // Format message with better escaping for Markdown
    const messageText = `
🔔 *New Booking Received\\!*

👤 *Name:* ${bookingData.name.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
📞 *Phone:* ${bookingData.phone.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
📧 *Email:* ${bookingData.email.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
🛎️ *Service:* ${bookingData.service.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
📅 *Date:* ${bookingData.date.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
💬 *Message:* ${bookingData.message.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}
⏰ *Submitted:* ${bookingData.submittedAt.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}

📸 *Screenshot:* [View Image](${bookingData.screenshotUrl})
    `.trim()

    // Send text message first
    const textResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: false,
      }),
    })

    const textResult = await textResponse.json()

    if (!textResponse.ok) {
      console.error("Telegram API Error:", {
        status: textResponse.status,
        error: textResult,
        botToken: BOT_TOKEN.substring(0, 10) + "...",
        chatId,
        botId,
      })

      // Provide specific error messages
      if (textResult.error_code === 403 && textResult.description?.includes("bots can't send messages to bots")) {
        return {
          success: false,
          error: `You're trying to send messages to the bot itself (ID: ${botId}). You need to use YOUR personal chat ID, not the bot's ID. Please visit the setup page to get your correct chat ID.`,
        }
      }

      if (textResult.error_code === 401) {
        return {
          success: false,
          error: `Bot token is invalid or expired. Please check your TELEGRAM_BOT_TOKEN in environment variables.`,
        }
      }

      if (textResult.error_code === 400 && textResult.description?.includes("chat not found")) {
        return {
          success: false,
          error: `Chat not found. Please make sure you've started a conversation with your bot and the chat ID (${chatId}) is correct. Your chat ID should be different from the bot ID (${botId}).`,
        }
      }

      if (textResult.error_code === 403 && textResult.description?.includes("bot was blocked")) {
        return {
          success: false,
          error: `The bot was blocked by the user. Please unblock the bot in Telegram and try again.`,
        }
      }

      return {
        success: false,
        error: `Telegram API error (${textResult.error_code}): ${textResult.description || "Unknown error"}`,
      }
    }

    console.log("Text message sent successfully")

    // Send screenshot as photo
    try {
      const photoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          photo: bookingData.screenshotUrl,
          caption: `📸 Screenshot from ${bookingData.name}'s booking`,
        }),
      })

      const photoResult = await photoResponse.json()

      if (!photoResponse.ok) {
        console.error("Photo send failed:", photoResult)
      } else {
        console.log("Photo sent successfully")
      }
    } catch (photoError) {
      console.error("Photo send error:", photoError)
    }

    return { success: true }
  } catch (error) {
    console.error("Telegram send error:", error)
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// New improved booking notification function
export async function sendBookingToTelegram(bookingDetails: BookingDetails) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error("Telegram credentials not configured")
    return { success: false, error: "Telegram not configured" }
  }

  // Validate bot token format
  if (!validateBotToken(botToken)) {
    return {
      success: false,
      error: "Invalid bot token format. Bot token should be in format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
    }
  }

  // Validate chat ID
  const chatIdValidation = validateChatId(chatId, botToken)
  if (!chatIdValidation.valid) {
    return {
      success: false,
      error: chatIdValidation.error,
    }
  }

  // Format booking message
  const message = `🎯 *New Booking Received - WanderRift*

🏔️ *Trip Details:*
• Destination: ${bookingDetails.tripDestination}
• Travelers: ${bookingDetails.numTravelers} person(s)

👤 *Customer Details:*
• Name: ${bookingDetails.userName}
• Phone: ${bookingDetails.userPhone}
• Email: ${bookingDetails.userEmail}

💳 *Payment Details:*
• Method: ${bookingDetails.paymentMethod}
• Status: Pending Confirmation

🆔 *Booking ID:* ${bookingDetails.bookingId || "N/A"}
⏰ *Booking Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

📸 Payment screenshot attached below ⬇️
  `

  try {
    // Send text message first
    const textResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    if (!textResponse.ok) {
      const errorData = await textResponse.json()
      console.error("Telegram text message error:", errorData)

      // Provide specific error messages
      if (errorData.error_code === 403 && errorData.description?.includes("bots can't send messages to bots")) {
        const botId = getBotIdFromToken(botToken)
        return {
          success: false,
          error: `You're trying to send messages to the bot itself (ID: ${botId}). You need to use YOUR personal chat ID, not the bot's ID.`,
        }
      }

      if (errorData.error_code === 400 && errorData.description?.includes("chat not found")) {
        return {
          success: false,
          error: `Chat not found. Please make sure you've started a conversation with your bot and the chat ID is correct.`,
        }
      }

      return { success: false, error: "Failed to send message" }
    }

    // Send screenshot if available
    if (bookingDetails.screenshotUrl) {
      const photoResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          photo: bookingDetails.screenshotUrl,
          caption: `💳 Payment Screenshot\n👤 Customer: ${bookingDetails.userName}\n🎯 Trip: ${bookingDetails.tripDestination}`,
        }),
      })

      if (!photoResponse.ok) {
        const errorData = await photoResponse.json()
        console.error("Telegram photo error:", errorData)
        // Don't fail the whole process if photo fails
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Telegram API Error:", error)
    return { success: false, error: "Network error" }
  }
}

export async function sendPaymentConfirmation(customerName: string, tripDestination: string, bookingId: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    return { success: false, error: "Telegram not configured" }
  }

  // Validate bot token format
  if (!validateBotToken(botToken)) {
    return {
      success: false,
      error: "Invalid bot token format",
    }
  }

  // Validate chat ID
  const chatIdValidation = validateChatId(chatId, botToken)
  if (!chatIdValidation.valid) {
    return {
      success: false,
      error: chatIdValidation.error,
    }
  }

  const message = `✅ *PAYMENT CONFIRMED - WanderRift*

👤 *Customer:* ${customerName}
🎯 *Trip:* ${tripDestination}
🆔 *Booking ID:* ${bookingId}
⏰ *Confirmed at:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

🎉 *Status: PAYMENT CONFIRMED* ✅

Customer can now proceed with their trip planning!
  `

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Telegram confirmation error:", errorData)
      return { success: false, error: "Failed to send confirmation" }
    }

    return { success: true }
  } catch (error) {
    console.error("Telegram confirmation error:", error)
    return { success: false, error: "Network error" }
  }
}

// Helper function to test Telegram connection
export async function testTelegramConnection() {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    if (!BOT_TOKEN) {
      return { success: false, error: "TELEGRAM_BOT_TOKEN not found in environment variables" }
    }

    if (!CHAT_ID) {
      return { success: false, error: "TELEGRAM_CHAT_ID not found in environment variables" }
    }

    if (!validateBotToken(BOT_TOKEN)) {
      return { success: false, error: "Invalid bot token format" }
    }

    // Validate chat ID
    const chatIdValidation = validateChatId(CHAT_ID, BOT_TOKEN)
    if (!chatIdValidation.valid) {
      return { success: false, error: chatIdValidation.error }
    }

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: "🧪 Test message from your booking system! If you see this, the integration is working correctly.",
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const botId = getBotIdFromToken(BOT_TOKEN)
      return {
        success: false,
        error: result.description || "Unknown error",
        details: result,
        debugInfo: {
          tokenValid: validateBotToken(BOT_TOKEN),
          botId,
          chatId: CHAT_ID,
          isSameBotAndChat: botId === CHAT_ID,
        },
      }
    }

    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Network error" }
  }
}

// Helper function to get bot info
export async function getBotInfo() {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

    if (!BOT_TOKEN) {
      return { success: false, error: "TELEGRAM_BOT_TOKEN not found in environment variables" }
    }

    if (!validateBotToken(BOT_TOKEN)) {
      return {
        success: false,
        error: "Invalid bot token format. Expected format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
      }
    }

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.description || "Unknown error",
        debugInfo: {
          tokenPrefix: BOT_TOKEN.substring(0, 10) + "...",
          tokenValid: validateBotToken(BOT_TOKEN),
        },
      }
    }

    return { success: true, data: result.result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Network error" }
  }
}

// Helper function to validate environment variables
export function validateEnvironment() {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID

  const issues = []

  if (!BOT_TOKEN) {
    issues.push("TELEGRAM_BOT_TOKEN is missing")
  } else if (!validateBotToken(BOT_TOKEN)) {
    issues.push("TELEGRAM_BOT_TOKEN has invalid format")
  }

  if (!CHAT_ID) {
    issues.push("TELEGRAM_CHAT_ID is missing")
  } else if (CHAT_ID === "your_chat_id_here") {
    issues.push("TELEGRAM_CHAT_ID is not configured (still has placeholder value)")
  } else if (BOT_TOKEN) {
    const chatIdValidation = validateChatId(CHAT_ID, BOT_TOKEN)
    if (!chatIdValidation.valid) {
      issues.push(`TELEGRAM_CHAT_ID issue: ${chatIdValidation.error}`)
    }
  }

  const botId = BOT_TOKEN ? getBotIdFromToken(BOT_TOKEN) : null

  return {
    valid: issues.length === 0,
    issues,
    debugInfo: {
      hasToken: !!BOT_TOKEN,
      tokenLength: BOT_TOKEN?.length || 0,
      tokenFormat: BOT_TOKEN ? validateBotToken(BOT_TOKEN) : false,
      hasChatId: !!CHAT_ID,
      chatId: CHAT_ID || "not set",
      botId,
      isSameBotAndChat: botId === CHAT_ID,
    },
  }
}
