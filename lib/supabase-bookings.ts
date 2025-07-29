import { supabaseServer } from "./supabase-server";

export interface BookingRecord {
  id?: number
  trip_id: number
  user_name: string
  user_email: string
  user_phone: string
  num_travelers: number
  payment_method_id: number
  payment_method_name?: string
  screenshot_url?: string
  payment_screenshot_url?: string // for backward compatibility
  payment_status: "pending" | "confirmed" | "failed"
  booking_status?: string // for backward compatibility
  trip_destination?: string
  booking_date?: string
  payment_confirmed_at?: string
}

export async function saveBookingToSupabase(bookingData: BookingRecord) {
  try {
    const { data, error } = await supabaseServer
      .from("bookings")
      .insert([
        {
          ...bookingData,
          booking_date: new Date().toISOString(),
          booking_status: "pending", // for backward compatibility
          payment_screenshot_url: bookingData.screenshot_url, // for backward compatibility
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      throw error
    }

    return { success: true, booking: data }
  } catch (error) {
    console.error("Database save error:", error)
    throw error
  }
}

export async function confirmPaymentInSupabase(bookingId: string) {
  try {
    const { data, error } = await supabaseServer
      .from("bookings")
      .update({
        payment_status: "confirmed",
        booking_status: "confirmed", // for backward compatibility
        payment_confirmed_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (error) {
      console.error("Payment confirmation error:", error)
      throw error
    }

    return { success: true, booking: data }
  } catch (error) {
    console.error("Payment confirmation error:", error)
    throw error
  }
}

export async function getAllBookingsFromSupabase() {
  try {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select(`
        *,
        trips:trip_id(destination, cost),
        payment_methods:payment_method_id(name, type)
      `)
      .order("booking_date", { ascending: false })

    if (error) {
      console.error("Fetch bookings error:", error)
      throw error
    }

    return { success: true, bookings: data }
  } catch (error) {
    console.error("Fetch bookings error:", error)
    throw error
  }
}
