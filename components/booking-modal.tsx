"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2, XCircle, IndianRupee, QrCode, Banknote } from "lucide-react"
import { type Trip, type PaymentMethod, getPaymentMethods } from "@/lib/data"
import { createBookingAction } from "@/app/actions" // Import the server action
import Image from "next/image"

interface BookingModalProps {
  trip: Trip
}

export default function BookingModal({ trip }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    numTravelers: "1",
    paymentMethodId: "",
    paymentScreenshot: null as File | null,
  })
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)

  const availableSeats = (trip.total_seats ?? 0) - (trip.booked_seats ?? 0)

  useEffect(() => {
    async function fetchPaymentOptions() {
      try {
        const methods = await getPaymentMethods()
        setPaymentMethods(methods)
        if (methods.length > 0) {
          setFormData((prev) => ({ ...prev, paymentMethodId: String(methods[0].id) }))
          setSelectedPaymentMethod(methods[0])
        }
      } catch (error) {
        console.error("Failed to fetch payment methods:", error)
        setMessage("Failed to load payment options. Please try again.")
        setBookingStatus("error")
      }
    }
    if (isOpen) {
      fetchPaymentOptions()
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    const method = paymentMethods.find((m) => String(m.id) === value)
    setFormData((prev) => ({ ...prev, paymentMethodId: value }))
    setSelectedPaymentMethod(method || null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, paymentScreenshot: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setBookingStatus("idle")
    setMessage("")

    if (Number(formData.numTravelers) > availableSeats) {
      setMessage(`Only ${availableSeats} seats left. You requested ${formData.numTravelers}.`)
      setBookingStatus("error")
      setIsLoading(false)
      return
    }

    try {
      // Create FormData for server action (यहाँ change किया है)
      const formDataToSend = new FormData()
      formDataToSend.append("tripId", String(trip.id))
      formDataToSend.append("userName", formData.userName)
      formDataToSend.append("userEmail", formData.userEmail)
      formDataToSend.append("userPhone", formData.userPhone)
      formDataToSend.append("numTravelers", formData.numTravelers)
      formDataToSend.append("paymentMethodId", formData.paymentMethodId)

      // Add file if exists
      if (formData.paymentScreenshot) {
        formDataToSend.append("paymentScreenshot", formData.paymentScreenshot)
      }

      // Call server action with FormData
      const result = await createBookingAction(formDataToSend)

      if (result.success) {
        setBookingStatus("success")
        setMessage(result.message)

        // Reset form after successful booking
        setTimeout(() => {
          setFormData({
            userName: "",
            userEmail: "",
            userPhone: "",
            numTravelers: "1",
            paymentMethodId: paymentMethods.length > 0 ? String(paymentMethods[0].id) : "",
            paymentScreenshot: null,
          })
          setBookingStatus("idle")
          setMessage("")
          // Optionally close modal after 3 seconds
          // setIsOpen(false)
        }, 3000)
      } else {
        setBookingStatus("error")
        setMessage(result.message)
      }
    } catch (error: any) {
      console.error("Booking submission error:", error)
      setBookingStatus("error")
      setMessage(`An unexpected error occurred: ${error.message || "Please try again."}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Book Now button - बिल्कुल same रखा है */}
        <Button className="w-full bg-brand-red hover:bg-brand-red/90" size="lg" disabled={!availableSeats}>
          {availableSeats > 0 ? (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Book Now
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 mr-2" />
              Sold Out
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Your Trip to {trip.destination}</DialogTitle>
          <DialogDescription>
            Fill out the form below to confirm your booking. Seats left: {availableSeats}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="userName" className="text-right">
              Full Name
            </Label>
            <Input id="userName" value={formData.userName} onChange={handleInputChange} required />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="userEmail" className="text-right">
              Email
            </Label>
            <Input id="userEmail" type="email" value={formData.userEmail} onChange={handleInputChange} required />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="userPhone" className="text-right">
              Phone
            </Label>
            <Input id="userPhone" type="tel" value={formData.userPhone} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="numTravelers" className="text-right">
              Travelers
            </Label>
            <Input
              id="numTravelers"
              type="number"
              value={formData.numTravelers}
              onChange={handleInputChange}
              min="1"
              max={availableSeats}
              required
            />
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right">
              Payment Method
            </Label>
            <Select value={formData.paymentMethodId} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={String(method.id)}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPaymentMethod && (
            <div className="col-span-4 p-4 border rounded-md bg-muted/50">
              <h4 className="font-semibold mb-2 flex items-center">
                {selectedPaymentMethod.type === "UPI" && <IndianRupee className="h-4 w-4 mr-2" />}
                {selectedPaymentMethod.type === "QR_CODE" && <QrCode className="h-4 w-4 mr-2" />}
                {selectedPaymentMethod.type === "BANK_TRANSFER" && <Banknote className="h-4 w-4 mr-2" />}
                {selectedPaymentMethod.name} Details:
              </h4>
              {selectedPaymentMethod.type === "QR_CODE" ? (
                <div className="flex justify-center">
                  <Image
                    src={selectedPaymentMethod.value || "/placeholder.svg"}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="rounded-md"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground break-all">{selectedPaymentMethod.value}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">Please make the payment to the details above.</p>
            </div>
          )}

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="paymentScreenshot" className="text-right">
              Payment Proof
            </Label>
            <div className="col-span-1">
              <Input
                id="paymentScreenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Upload a screenshot of your payment confirmation.</p>
            </div>
          </div>

          {bookingStatus === "success" && (
            <div className="flex items-center text-green-600 mt-4 p-3 bg-green-50 rounded-md border border-green-200">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">{message}</p>
                <p className="text-sm text-green-700 mt-1">
                  📱 Booking details have been sent to our team via Telegram for confirmation!
                </p>
              </div>
            </div>
          )}
          {bookingStatus === "error" && (
            <div className="flex items-center text-red-600 mt-4 p-3 bg-red-50 rounded-md border border-red-200">
              <XCircle className="h-5 w-5 mr-2" />
              <p>{message}</p>
            </div>
          )}

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
