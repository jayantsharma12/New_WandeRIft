"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { sendBookingToTelegram } from "@/lib/telegram"
import { saveBookingToDatabase, getTrip, getPaymentMethod, incrementTripBookedSeats } from "@/lib/data"

export async function createBookingAction(formData: FormData) {
  try {
    // Extract form data
    const tripId = Number(formData.get("tripId"))
    const userName = formData.get("userName") as string
    const userEmail = formData.get("userEmail") as string
    const userPhone = formData.get("userPhone") as string
    const numTravelers = Number(formData.get("numTravelers"))
    const paymentMethodId = Number(formData.get("paymentMethodId"))
    const paymentScreenshot = formData.get("paymentScreenshot") as File

    // Validate required fields
    if (!tripId || !userName || !userEmail || !numTravelers || !paymentMethodId) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Get trip and payment method details
    const trip = await getTrip(tripId)
    const paymentMethod = await getPaymentMethod(paymentMethodId)

    if (!trip) {
      return {
        success: false,
        message: "Trip not found.",
      }
    }

    if (!paymentMethod) {
      return {
        success: false,
        message: "Payment method not found.",
      }
    }

    // Check seat availability
    const availableSeats = (trip.total_seats ?? 0) - (trip.booked_seats ?? 0)
    if (numTravelers > availableSeats) {
      return {
        success: false,
        message: `Only ${availableSeats} seats available. You requested ${numTravelers}.`,
      }
    }

    let screenshotUrl = ""

    // Upload screenshot to Vercel Blob if provided
    if (paymentScreenshot && paymentScreenshot.size > 0) {
      try {
        const blob = await put(
          `payment-screenshots/${Date.now()}-${tripId}-${userName.replace(/\s+/g, "-")}.${paymentScreenshot.name.split(".").pop()}`,
          paymentScreenshot,
          {
            access: "public",
          },
        )
        screenshotUrl = blob.url
      } catch (error) {
        console.error("Screenshot upload error:", error)
        return {
          success: false,
          message: "Failed to upload payment screenshot. Please try again.",
        }
      }
    }

    // Save booking to database
    const bookingRecord = {
      trip_id: tripId,
      user_name: userName,
      user_email: userEmail,
      user_phone: userPhone,
      num_travelers: numTravelers,
      payment_method_id: paymentMethodId,
      payment_method_name: paymentMethod.name,
      screenshot_url: screenshotUrl,
      payment_status: "pending" as const,
      trip_destination: trip.destination,
    }

    const supabaseResult = await saveBookingToDatabase(bookingRecord)

    // ✅ FIXED: Send booking details to Telegram with CORRECT parameters
    const telegramResult = await sendBookingToTelegram({
      tripDestination: trip.destination, // ✅ Correct parameter name
      userName: userName, // ✅ Correct parameter name
      userPhone: userPhone, // ✅ Correct parameter name
      userEmail: userEmail, // ✅ Correct parameter name
      numTravelers: numTravelers.toString(), // ✅ Correct parameter name
      paymentMethod: paymentMethod.name, // ✅ Correct parameter name
      screenshotUrl: screenshotUrl, // ✅ Correct parameter name
      bookingId: supabaseResult.booking.id.toString(), // ✅ Correct parameter name
    })

    if (!telegramResult.success) {
      console.error("Telegram notification failed:", telegramResult.error)
      // Don't fail the booking if Telegram fails, just log it
    }

    // Update trip booked seats
    const seatUpdateResult = await incrementTripBookedSeats(tripId, numTravelers)
    if (!seatUpdateResult.success) {
      console.error("Failed to update trip seats:", seatUpdateResult.message)
      // Don't fail the booking if seat update fails
    }

    // Revalidate relevant paths
    revalidatePath("/")
    revalidatePath("/trips")
    revalidatePath(`/trips/${tripId}`)

    return {
      success: true,
      message: `Booking confirmed! Your booking ID is ${supabaseResult.booking.id}. We'll review your payment and confirm shortly.`,
      bookingId: supabaseResult.booking.id,
    }
  } catch (error) {
    console.error("Booking creation error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
