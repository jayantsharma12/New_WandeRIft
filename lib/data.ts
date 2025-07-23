import { supabase } from "./supabase"

export interface Review {
  id: number
  trip_id: number
  user_name: string
  rating: number
  comment: string
}

export interface Trip {
  id: number
  destination: string
  days: number
  budget: "Budget" | "Moderate" | "Luxury"
  cost: number
  rating: number
  interests: string[]
  itinerary: string[]
  image_url?: string // New: Optional image URL for the trip
  total_seats?: number // New: Total available seats
  booked_seats?: number // New: Number of booked seats
  start_date?: string // New: Start date of the trip
  end_date?: string // New: End date of the trip
  reviews?: Review[] // Optional, will be fetched separately or joined
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
  booking_status?: string
  booking_date?: string
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
    throw err // Re-throw to be caught by calling component
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
        // No rows found
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
      // Still return trip data even if reviews fail
      return { ...tripData, reviews: [] } as Trip
    }

    return { ...tripData, reviews: reviewsData } as Trip
  } catch (err) {
    console.error("Caught error in getTripById:", err)
    throw err // Re-throw to be caught by calling component
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

    // Map the data to the desired structure
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
    throw err // Re-throw to be caught by calling component
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
): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from("bookings").insert([booking]).select()

    if (error) {
      console.error("Error creating booking:", error.message)
      return { success: false, message: `Failed to create booking: ${error.message}` }
    }
    return { success: true, message: "Booking created successfully!" }
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
