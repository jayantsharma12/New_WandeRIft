"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Phone, Mail, Calendar, Users } from "lucide-react"

interface Booking {
  id: string
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
  created_at: string
}

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmingPayment, setConfirmingPayment] = useState<string | null>(null)

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

  const confirmPayment = async (bookingId: string) => {
    setConfirmingPayment(bookingId)
    try {
      const response = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      })

      const result = await response.json()
      if (result.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((booking) => (booking.id === bookingId ? { ...booking, payment_status: "confirmed" } : booking)),
        )
      }
    } catch (error) {
      console.error("Failed to confirm payment:", error)
    } finally {
      setConfirmingPayment(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading bookings...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Booking Management</h1>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {booking.name}
                </CardTitle>
                <Badge
                  variant={booking.payment_status === "confirmed" ? "default" : "secondary"}
                  className={booking.payment_status === "confirmed" ? "bg-green-500" : ""}
                >
                  {booking.payment_status === "confirmed" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmed
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{booking.phone}</span>
                  </div>
                  {booking.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{booking.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {booking.check_in} to {booking.check_out}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{booking.guests} guests</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p>
                    <strong>Room:</strong> {booking.room_type || "Standard"}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{booking.total_amount || "TBD"}
                  </p>
                  <p>
                    <strong>Booked:</strong> {new Date(booking.created_at).toLocaleString("en-IN")}
                  </p>

                  {booking.screenshot_url && (
                    <div>
                      <p className="font-medium mb-2">Payment Screenshot:</p>
                      <img
                        src={booking.screenshot_url || "/placeholder.svg"}
                        alt="Payment screenshot"
                        className="max-w-xs rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {booking.payment_status === "pending" && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={() => confirmPayment(booking.id)}
                    disabled={confirmingPayment === booking.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {confirmingPayment === booking.id ? (
                      "Confirming..."
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
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No bookings found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
