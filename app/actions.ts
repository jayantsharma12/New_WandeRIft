"use server"

import { put } from "@vercel/blob"
import { sendBookingToTelegram } from "@/lib/telegram"
import { getTrips, getPaymentMethods, createBooking, updateTripBookedSeats } from "@/lib/data"

export async function createBookingAction(formData: FormData) {
  try {
    console.log("=== BOOKING ACTION STARTED ===")

    // Extract form data
    const tripId = formData.get("tripId") as string
    const userName = formData.get("userName") as string
    const userEmail = formData.get("userEmail") as string
    const userPhone = formData.get("userPhone") as string
    const numTravelers = Number.parseInt(formData.get("numTravelers") as string)
    const paymentMethodId = Number.parseInt(formData.get("paymentMethodId") as string)
    const paymentScreenshot = formData.get("paymentScreenshot") as File

    console.log("Form data extracted:", {
      tripId,
      userName,
      userEmail,
      userPhone,
      numTravelers,
      paymentMethodId,
      hasScreenshot: !!paymentScreenshot,
    })

    // Validate required fields
    if (!tripId || !userName || !userEmail || !userPhone || !numTravelers || !paymentMethodId || !paymentScreenshot) {
      console.log("Validation failed - missing required fields")
      return {
        success: false,
        message: "Please fill in all required fields and upload a payment screenshot.",
      }
    }

    // Get trip and payment method details
    const trips = await getTrips()
    const trip = trips.find((t) => t.id === Number.parseInt(tripId))
    const paymentMethods = await getPaymentMethods()
    const paymentMethod = paymentMethods.find((p) => p.id === paymentMethodId)

    if (!trip) {
      console.log("Trip not found:", tripId)
      return {
        success: false,
        message: "Trip not found.",
      }
    }

    if (!paymentMethod) {
      console.log("Payment method not found:", paymentMethodId)
      return {
        success: false,
        message: "Payment method not found.",
      }
    }

    console.log("Trip and payment method found:", {
      tripDestination: trip.destination,
      tripTitle: trip.title,
      paymentMethodName: paymentMethod.name,
    })

    // Check availability
    const availableSeats = (trip.total_seats ?? 0) - (trip.booked_seats ?? 0)
    if (numTravelers > availableSeats) {
      console.log("Not enough seats:", { requested: numTravelers, available: availableSeats })
      return {
        success: false,
        message: `Only ${availableSeats} seats available. You requested ${numTravelers}.`,
      }
    }

    // Upload screenshot to Vercel Blob
    console.log("Uploading screenshot to Vercel Blob...")
    const timestamp = Date.now()
    const filename = `bookings/${timestamp}-${paymentScreenshot.name}`

    const blob = await put(filename, paymentScreenshot, {
      access: "public",
    })

    console.log("Screenshot uploaded:", blob.url)

    // Create booking in database
    console.log("Creating booking in database...")
    const bookingId = `WR-${timestamp}`

    const booking = await createBooking({
      id: bookingId,
      trip_id: Number.parseInt(tripId),
      user_name: userName,
      user_email: userEmail,
      user_phone: userPhone,
      num_travelers: numTravelers,
      payment_method_id: paymentMethodId,
      payment_screenshot_url: blob.url,
      screenshot_url: blob.url,
      booking_status: "pending",
      payment_status: "pending",
      trip_destination: trip.destination,
      payment_method_name: paymentMethod.name,
    })

    console.log("Booking created:", booking)

    // Update trip booked seats
    const seatUpdateResult = await updateTripBookedSeats(Number.parseInt(tripId), numTravelers)
    if (!seatUpdateResult.success) {
      console.warn("Failed to update trip seats:", seatUpdateResult.message)
    } else {
      console.log("Trip seats updated successfully")
    }

    // Prepare Telegram notification data
    const telegramData = {
      tripDestination: trip.destination,
      userName,
      userPhone,
      userEmail,
      numTravelers: numTravelers.toString(),
      paymentMethod: paymentMethod.name,
      screenshotUrl: blob.url,
      bookingId,
    }

    console.log("Sending Telegram notification...")

    // Send Telegram notification
    const telegramResult = await sendBookingToTelegram(telegramData)

    console.log("Telegram result:", telegramResult)

    if (telegramResult.success) {
      console.log("=== BOOKING COMPLETED SUCCESSFULLY WITH TELEGRAM ===")
      return {
        success: true,
        message:
          "Booking submitted successfully! You will receive confirmation shortly. Admin has been notified via Telegram.",
      }
    } else {
      console.log("=== BOOKING COMPLETED BUT TELEGRAM FAILED ===")
      console.log("Telegram error:", telegramResult.error)

      return {
        success: true,
        message: `Booking submitted successfully! You will receive confirmation shortly. Note: Admin notification could not be sent, but your booking is confirmed.`,
      }
    }
  } catch (error) {
    console.error("=== BOOKING ACTION ERROR ===")
    console.error("Error details:", error)

    return {
      success: false,
      message: `Booking failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
