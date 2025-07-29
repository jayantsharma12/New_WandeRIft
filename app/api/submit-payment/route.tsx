import { type NextRequest, NextResponse } from "next/server"
import { sendBookingToTelegram } from "@/lib/telegram"
import { saveBookingToDatabase } from "@/lib/data" // ✅ Using the correct function

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()

    // ✅ FIXED: Save to Supabase with correct parameter names
    const supabaseResult = await saveBookingToDatabase({
      trip_id: bookingData.tripId, // ✅ Correct field name
      user_name: bookingData.userName, // ✅ Correct field name
      user_email: bookingData.userEmail, // ✅ Correct field name
      user_phone: bookingData.userPhone, // ✅ Correct field name
      num_travelers: bookingData.numTravelers, // ✅ Correct field name
      payment_method_id: bookingData.paymentMethodId, // ✅ Correct field name
      payment_method_name: bookingData.paymentMethodName, // ✅ Added
      screenshot_url: bookingData.screenshotUrl, // ✅ Correct field name
      payment_status: "pending", // ✅ Correct field name
      trip_destination: bookingData.tripDestination, // ✅ Added
    })

    // ✅ FIXED: Send to Telegram with correct parameter names
    await sendBookingToTelegram({
      tripDestination: bookingData.tripDestination, // ✅ Correct parameter name
      userName: bookingData.userName, // ✅ Correct parameter name
      userPhone: bookingData.userPhone, // ✅ Correct parameter name
      userEmail: bookingData.userEmail, // ✅ Correct parameter name
      numTravelers: bookingData.numTravelers.toString(), // ✅ Correct parameter name
      paymentMethod: bookingData.paymentMethodName, // ✅ Correct parameter name
      screenshotUrl: bookingData.screenshotUrl, // ✅ Correct parameter name
      bookingId: supabaseResult.booking.id.toString(), // ✅ Added booking ID
    })

    return NextResponse.json({
      success: true,
      bookingId: supabaseResult.booking.id,
      message: "Booking submitted successfully and sent to Telegram!",
    })
  } catch (error) {
    console.error("Booking submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit booking",
      },
      { status: 500 },
    )
  }
}
