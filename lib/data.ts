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
  reviews?: Review[] // Optional, will be fetched separately or joined
}

/**
 * Fetches all trips from Supabase.
 */
export async function getTrips(): Promise<Trip[]> {
  try {
    const { data, error } = await supabase.from("trips").select("*").order("id", { ascending: true })

    if (error) {
      console.error("Supabase error fetching trips:", error) // Added for debugging
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
      console.error(`Supabase error fetching trip with ID ${id}:`, tripError) // Added for debugging
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
      console.error(`Supabase error fetching reviews for trip ID ${id}:`, reviewsError) // Added for debugging
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
      .select(`
        *,
        trips (
          destination,
          days,
          budget
        )
      `)
      .order("rating", { ascending: false })

    if (error) {
      console.error("Supabase error fetching all reviews:", error) // Added for debugging
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
