import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from("trips").select("id, destination").limit(1)

    if (error) {
      console.error("Supabase connection check failed:", error)
      return NextResponse.json(
        {
          status: "error",
          message: "Supabase connection or table access failed.",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    if (data && data.length > 0) {
      return NextResponse.json(
        {
          status: "success",
          message: "Supabase connected successfully and 'trips' table is accessible.",
          example_data: data[0],
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        {
          status: "warning",
          message: "Supabase connected, but 'trips' table is empty or no data found.",
        },
        { status: 200 },
      )
    }
  } catch (err: any) {
    console.error("Unexpected error during Supabase check:", err)
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred while checking Supabase connection.",
        details: err.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
