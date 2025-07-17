import { createClient } from "@supabase/supabase-js"

// Ensure these environment variables are set in your .env.local file
// They must be prefixed with NEXT_PUBLIC_ to be accessible on the client-side.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate that the required values are present
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Please check your .env.local file.")
  throw new Error(
    "Supabase configuration is incomplete. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.",
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
