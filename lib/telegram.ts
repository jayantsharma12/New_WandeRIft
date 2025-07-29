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

export async function sendBookingToTelegram(bookingDetails: BookingDetails) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error("Telegram credentials not configured")
    return { success: false, error: "Telegram not configured" }
  }

  // Format booking message
  const message = `
🎯 *New Booking Received - WanderRift*

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

  const message = `
✅ *PAYMENT CONFIRMED - WanderRift*

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
