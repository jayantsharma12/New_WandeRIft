import { type NextRequest, NextResponse } from "next/server"
import { confirmPaymentInSupabase, getAllBookingsFromSupabase } from "@/lib/supabase-bookings"
import { sendPaymentConfirmation } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 })
    }

    // Update payment status in Supabase
    const result = await confirmPaymentInSupabase(bookingId)

    // Send confirmation to Telegram
    const telegramResult = await sendPaymentConfirmation(
      result.booking.user_name,
      result.booking.trip_destination || result.booking.trips?.destination || "Unknown Destination",
      bookingId,
    )

    if (!telegramResult.success) {
      console.error("Telegram confirmation failed:", telegramResult.error)
      // Don't fail the API call if Telegram fails
    }

    return NextResponse.json({
      success: true,
      message: "Payment confirmed successfully!",
      booking: result.booking,
    })
  } catch (error) {
    console.error("Payment confirmation error:", error)
    return NextResponse.json({ success: false, error: "Failed to confirm payment" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await getAllBookingsFromSupabase()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 })
  }
}
