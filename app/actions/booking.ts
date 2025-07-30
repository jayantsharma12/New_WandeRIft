"use server"

import { put } from "@vercel/blob"
import { sendToTelegram } from "../../lib/telegram"

export async function submitBooking(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const service = formData.get("service") as string
    const date = formData.get("date") as string
    const message = formData.get("message") as string
    const screenshot = formData.get("screenshot") as File

    // Validate required fields
    if (!name || !phone || !service || !date || !screenshot) {
      return { success: false, error: "Please fill all required fields" }
    }

    // Upload screenshot to Vercel Blob
    const blob = await put(`bookings/${Date.now()}-${screenshot.name}`, screenshot, {
      access: "public",
    })

    // Prepare booking data
    const bookingData = {
      name,
      phone,
      email: email || "Not provided",
      service,
      date,
      message: message || "No additional details",
      screenshotUrl: blob.url,
      submittedAt: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "short",
      }),
    }

    // Send to Telegram
    const telegramResult = await sendToTelegram(bookingData)

    if (!telegramResult.success) {
      return { success: false, error: "Failed to send notification" }
    }

    return { success: true }
  } catch (error) {
    console.error("Booking submission error:", error)
    return { success: false, error: "Internal server error" }
  }
}
