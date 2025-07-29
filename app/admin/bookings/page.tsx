"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Phone, Mail, Calendar, Users, MapPin, CreditCard, IndianRupee } from "lucide-react"
import Image from "next/image"

interface Booking {
  id: number
  user_name: string
  user_email: string
  user_phone: string
  num_travelers: number
  screenshot_url?: string
  payment_screenshot_url?: string
  payment_status: "pending" | "confirmed" | "failed"
  booking_status?: string
  booking_date: string
  payment_confirmed_at?: string
  trip_destination?: string
  payment_method_name?: string
  trips?: {
    destination: string
    cost?: number
  }
  payment_methods?: {
    name: string
    type: string
  }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmingPayment, setConfirmingPayment] = useState<number | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/confirm-payment")
      const result = await response.json()
      if (result.success) {
        setBookings(result.bookings)
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const confirmPayment = async (bookingId: number) => {
    setConfirmingPayment(bookingId)
    try {
      const response = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: bookingId.toString() }),
      })

      const result = await response.json()
      if (result.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? { ...booking, payment_status: "confirmed", payment_confirmed_at: new Date().toISOString() }
              : booking,
          ),
        )
      } else {
        alert("Failed to confirm payment: " + result.error)
      }
    } catch (error) {
      console.error("Failed to confirm payment:", error)
      alert("Failed to confirm payment. Please try again.")
    } finally {
      setConfirmingPayment(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-950">WanderRift Booking Management</h1>
        <p className="text-muted-foreground mt-2">Manage and confirm customer bookings</p>
      </div>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {booking.user_name}
                </CardTitle>
                <Badge
                  variant={booking.payment_status === "confirmed" ? "default" : "secondary"}
                  className={booking.payment_status === "confirmed" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {booking.payment_status === "confirmed" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Payment Confirmed
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Payment Pending
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-950">Customer Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.user_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.user_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.num_travelers} traveler(s)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-950">Trip Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.trip_destination || booking.trips?.destination || "Unknown Destination"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {booking.payment_method_name || booking.payment_methods?.name || "Unknown Payment Method"}
                      </span>
                    </div>
                    {booking.trips?.cost && (
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span>₹{booking.trips.cost * booking.num_travelers}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Booked: {new Date(booking.booking_date).toLocaleString("en-IN")}</span>
                    </div>
                    {booking.payment_confirmed_at && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">
                          Confirmed: {new Date(booking.payment_confirmed_at).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(booking.screenshot_url || booking.payment_screenshot_url) && (
                <div className="mt-6">
                  <h4 className="font-semibold text-orange-950 mb-3">Payment Screenshot</h4>
                  <div className="max-w-md">
                    <Image
                      src={booking.screenshot_url || booking.payment_screenshot_url || "/placeholder.svg"}
                      alt="Payment screenshot"
                      width={400}
                      height={300}
                      className="rounded-lg border shadow-sm"
                    />
                  </div>
                </div>
              )}

              {booking.payment_status === "pending" && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={() => confirmPayment(booking.id)}
                    disabled={confirmingPayment === booking.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {confirmingPayment === booking.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Payment
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {bookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No bookings found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
