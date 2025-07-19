"use server"
import { createBooking, updateTripBookedSeats } from "@/lib/data"; // Import data functions
import { supabase } from "@/lib/supabase"; // Declare the supabase variable
import { revalidatePath } from "next/cache"; // For revalidating data after booking

interface CreateBookingActionParams {
  tripId: number
  userName: string
  userEmail: string
  userPhone: string
  numTravelers: number
  paymentMethodId: number
  paymentScreenshot: File | null
}

export async function createBookingAction({
  tripId,
  userName,
  userEmail,
  userPhone,
  numTravelers,
  paymentMethodId,
  paymentScreenshot,
}: CreateBookingActionParams) {
  let screenshotUrl: string | undefined

  try {
    // 1. Upload payment screenshot to Vercel Blob
    if (paymentScreenshot) {
      const filename = `${Date.now()}-${paymentScreenshot.name}`
      const blob = await put(filename, paymentScreenshot, {
        access: "public",
      })
      screenshotUrl = blob.url
    }

    // 2. Create booking in Supabase
    const bookingResult = await createBooking({
      trip_id: tripId,
      user_name: userName,
      user_email: userEmail,
      user_phone: userPhone,
      num_travelers: numTravelers,
      payment_method_id: paymentMethodId,
      payment_screenshot_url: screenshotUrl,
      booking_status: "pending", // Initial status
    })

    if (!bookingResult.success) {
      return { success: false, message: `Booking failed: ${bookingResult.message}` }
    }

    // 3. Update booked seats in trips table
    // First, get the current trip data to calculate new booked seats
    const { data: tripData, error: tripError } = await supabase
      .from("trips")
      .select("total_seats, booked_seats")
      .eq("id", tripId)
      .single()

    if (tripError || !tripData) {
      console.error("Failed to fetch trip data for seat update:", tripError?.message || "No trip data")
      // Even if seat update fails, the booking is recorded.
      // In a real app, you might want to roll back the booking or flag for manual review.
      return { success: true, message: "Booking created, but failed to update seat count. Please contact support." }
    }

    const currentBookedSeats = tripData.booked_seats ?? 0
    const totalSeats = tripData.total_seats ?? 0
    const newBookedSeats = currentBookedSeats + numTravelers

    if (newBookedSeats > totalSeats) {
      // This should ideally be caught client-side, but as a server-side safeguard
      return { success: false, message: "Not enough seats available for this booking." }
    }

    const updateSeatsResult = await updateTripBookedSeats(tripId, newBookedSeats)

    if (!updateSeatsResult.success) {
      console.error("Failed to update trip seats:", updateSeatsResult.message)
      // Booking is still created, but seats might be out of sync.
      return { success: true, message: "Booking created, but failed to update seat count. Please contact support." }
    }

    // Revalidate the trip detail page to show updated seat count
    revalidatePath(`/trip/${tripId}`)
    revalidatePath(`/compare`) // Also revalidate compare page if it shows seat counts
    revalidatePath(`/`) // Revalidate home page if featured trips show seat counts

    return { success: true, message: "Trip booked successfully! Payment confirmation pending." }
  } catch (error: any) {
    console.error("Error in createBookingAction:", error)
    return { success: false, message: `An unexpected error occurred: ${error.message}` }
  }
}
