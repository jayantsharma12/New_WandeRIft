import { supabase } from "./supabase"

export interface Review {
  id: number
  trip_id: number
  user_name: string
  rating: number
  comment: string
}

export interface Trip {
  title: any
  id: number
  destination: string
  days: number
  budget: "Budget" | "Moderate" | "Luxury"
  cost: number
  rating: number
  interests: string[]
  itinerary: string[]
  image_url?: string
  total_seats?: number
  booked_seats?: number
  start_date?: string
  end_date?: string
  reviews?: Review[]
}

export interface PaymentMethod {
  id: number
  type: string
  name: string
  value: string
  is_active: boolean
}

export interface Booking {
  id?: number
  trip_id: number
  user_name: string
  user_email: string
  user_phone?: string
  num_travelers: number
  payment_method_id?: number
  payment_screenshot_url?: string
  screenshot_url?: string
  booking_status?: string
  payment_status?: "pending" | "confirmed" | "failed"
  booking_date?: string
  payment_confirmed_at?: string
  trip_destination?: string
  payment_method_name?: string
}

/**
 * Fetches all trips from Supabase.
 */
export async function getTrips(): Promise<Trip[]> {
  try {
    const { data, error } = await supabase.from("trips").select("*").order("id", { ascending: true })
    if (error) {
      console.error("Supabase error fetching trips:", error)
      console.error("Error message:", error.message)
      console.error("Error code:", error.code)
      throw new Error(`Failed to fetch trips: ${error.message}`)
    }
    return data as Trip[]
  } catch (err) {
    console.error("Caught error in getTrips:", err)
    throw err
  }
}

/**
 * Fetches a single trip by ID from Supabase, including its reviews.
 */
export async function getTripById(id: number): Promise<Trip | null> {
  try {
    const { data: tripData, error: tripError } = await supabase.from("trips").select("*").eq("id", id).single()
    if (tripError) {
      console.error(`Supabase error fetching trip with ID ${id}:`, tripError)
      console.error("Error message:", tripError.message)
      console.error("Error code:", tripError.code)
      if (tripError.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to fetch trip: ${tripError.message}`)
    }

    if (!tripData) {
      return null
    }

    const { data: reviewsData, error: reviewsError } = await supabase.from("reviews").select("*").eq("trip_id", id)
    if (reviewsError) {
      console.error(`Supabase error fetching reviews for trip ID ${id}:`, reviewsError)
      console.error("Error message:", reviewsError.message)
      console.error("Error code:", reviewsError.code)
      return { ...tripData, reviews: [] } as Trip
    }

    return { ...tripData, reviews: reviewsData } as Trip
  } catch (err) {
    console.error("Caught error in getTripById:", err)
    throw err
  }
}

/**
 * Fetches all reviews from Supabase, joining with trip data for destination and budget.
 */
export async function getAllReviews(): Promise<
  (Review & { destination: string; tripDays: number; tripBudget: string })[]
> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        trips (
          destination,
          days,
          budget
        )
      `,
      )
      .order("rating", { ascending: false })

    if (error) {
      console.error("Supabase error fetching all reviews:", error)
      console.error("Error message:", error.message)
      console.error("Error code:", error.code)
      throw new Error(`Failed to fetch reviews: ${error.message}`)
    }

    return data.map((review) => ({
      id: review.id,
      trip_id: review.trip_id,
      user_name: review.user_name,
      rating: review.rating,
      comment: review.comment,
      destination: (review.trips as { destination: string }).destination,
      tripDays: (review.trips as { days: number }).days,
      tripBudget: (review.trips as { budget: string }).budget,
    })) as (Review & { destination: string; tripDays: number; tripBudget: string })[]
  } catch (err) {
    console.error("Caught error in getAllReviews:", err)
    throw err
  }
}

/**
 * Fetches all active payment methods.
 */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase.from("payment_methods").select("*").eq("is_active", true)
    if (error) {
      console.error("Error fetching payment methods:", error.message)
      throw new Error(`Failed to fetch payment methods: ${error.message}`)
    }
    return data as PaymentMethod[]
  } catch (err) {
    console.error("Caught error in getPaymentMethods:", err)
    throw err
  }
}

/**
 * Creates a new booking.
 */
export async function createBooking(
  booking: Omit<Booking, "id" | "booking_date">,
): Promise<{ success: boolean; message: string; booking?: Booking }> {
  try {
    const bookingData = {
      ...booking,
      booking_date: new Date().toISOString(),
      booking_status: "pending",
      payment_status: "pending" as const,
    }

    const { data, error } = await supabase.from("bookings").insert([bookingData]).select().single()

    if (error) {
      console.error("Error creating booking:", error.message)
      return { success: false, message: `Failed to create booking: ${error.message}` }
    }

    return { success: true, message: "Booking created successfully!", booking: data as Booking }
  } catch (err: any) {
    console.error("Caught error in createBooking:", err)
    return { success: false, message: `An unexpected error occurred: ${err.message}` }
  }
}

/**
 * Updates the booked_seats for a specific trip.
 */
export async function updateTripBookedSeats(
  tripId: number,
  newBookedSeats: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase
      .from("trips")
      .update({ booked_seats: newBookedSeats })
      .eq("id", tripId)
      .select()

    if (error) {
      console.error(`Error updating booked seats for trip ${tripId}:`, error.message)
      return { success: false, message: `Failed to update seats: ${error.message}` }
    }

    return { success: true, message: "Seats updated successfully!" }
  } catch (err: any) {
    console.error("Caught error in updateTripBookedSeats:", err)
    return { success: false, message: `An unexpected error occurred: ${err.message}` }
  }
}

/**
 * Alias for getTripById (for server actions)
 */
export async function getTrip(id: number): Promise<Trip | null> {
  return await getTripById(id)
}

/**
 * Fetches a single payment method by ID
 */
export async function getPaymentMethod(id: number): Promise<PaymentMethod | null> {
  try {
    const { data, error } = await supabase.from("payment_methods").select("*").eq("id", id).single()
    if (error) {
      console.error(`Error fetching payment method with ID ${id}:`, error.message)
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to fetch payment method: ${error.message}`)
    }
    return data as PaymentMethod
  } catch (err) {
    console.error("Caught error in getPaymentMethod:", err)
    throw err
  }
}

/**
 * Updates trip booked seats by adding new travelers
 */
export async function incrementTripBookedSeats(
  tripId: number,
  additionalTravelers: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const trip = await getTripById(tripId)
    if (!trip) {
      return { success: false, message: "Trip not found" }
    }

    const newBookedSeats = (trip.booked_seats || 0) + additionalTravelers
    return await updateTripBookedSeats(tripId, newBookedSeats)
  } catch (err: any) {
    console.error("Caught error in incrementTripBookedSeats:", err)
    return { success: false, message: `An unexpected error occurred: ${err.message}` }
  }
}

// SERVER-SIDE FUNCTIONS
import { createClient } from "@supabase/supabase-js"

const getServerSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing server-side Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * SERVER-SIDE: Save booking with full permissions
 */
export async function saveBookingToDatabase(bookingData: Booking) {
  try {
    const supabaseServer = getServerSupabase()
    const { data, error } = await supabaseServer
      .from("bookings")
      .insert([
        {
          ...bookingData,
          booking_date: new Date().toISOString(),
          booking_status: "pending",
          payment_status: "pending",
          payment_screenshot_url: bookingData.screenshot_url,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Server-side booking save error:", error)
      throw error
    }

    return { success: true, booking: data }
  } catch (error) {
    console.error("Database save error:", error)
    throw error
  }
}

/**
 * SERVER-SIDE: Confirm payment with admin permissions
 */
export async function confirmPaymentInDatabase(bookingId: string) {
  try {
    const supabaseServer = getServerSupabase()
    const { data, error } = await supabaseServer
      .from("bookings")
      .update({
        payment_status: "confirmed",
        booking_status: "confirmed",
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

/**
 * SERVER-SIDE: Get all bookings with admin permissions
 */
export async function getAllBookingsFromDatabase() {
  try {
    const supabaseServer = getServerSupabase()
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
