import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface BookingData {
  name: string
  phone: string
  email?: string
  check_in: string
  check_out: string
  guests: number
  room_type?: string
  total_amount?: number
  screenshot_url?: string
  payment_status: "pending" | "confirmed" | "failed"
  created_at?: string
}

export async function saveBookingToSupabase(bookingData: BookingData) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          ...bookingData,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true, booking: data }
  } catch (error) {
    console.error("Supabase insert error:", error)
    throw error
  }
}

export async function confirmPayment(bookingId: string) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        payment_status: "confirmed",
        payment_confirmed_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true, booking: data }
  } catch (error) {
    console.error("Payment confirmation error:", error)
    throw error
  }
}

export async function getAllBookings() {
  try {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return { success: true, bookings: data }
  } catch (error) {
    console.error("Fetch bookings error:", error)
    throw error
  }
}
