import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Calendar, DollarSign, Users, Star, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image" // Import Image component
import { getTripById } from "@/lib/data" // Import getTripById and Trip type
import BookingModal from "@/components/booking-modal" // Import the new BookingModal

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const tripId = Number.parseInt(params.id)
  const trip = await getTripById(tripId)

  if (!trip) {
    notFound()
  }

  const seatsLeft = (trip.total_seats ?? 0) - (trip.booked_seats ?? 0)
  const isAvailable = seatsLeft > 0

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-orange-950">{trip.destination} Adventure</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span>
                    {trip.rating} ({trip.reviews?.length || 0} reviews)
                  </span>
                </div>
                <Badge variant="secondary">{trip.budget}</Badge>
              </div>
            </div>
            <Button asChild>
              <Link href="/planner">Plan Similar Trip</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={trip.image_url || "/placeholder.svg?height=256&width=600&text=Trip+Hero+Image"} // Use image_url or placeholder
                alt={`Hero image for ${trip.destination}`}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold">{trip.destination}</h2>
                <p className="text-lg opacity-90">{trip.days} Days of Adventure</p>
              </div>
            </div>

            {/* Trip Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold text-orange-950">{trip.days} Days</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="font-semibold text-orange-950">₹{(trip.cost ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Seats Left</p>
                    <p className="font-semibold text-orange-950">{seatsLeft}</p>
                  </div>
                  <div className="text-center">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold text-orange-950">{trip.budget}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Day-wise Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(trip.itinerary ?? []).map((day, index) => (
                    <div key={index} className="border-l-4 border-primary pl-6 pb-6 last:pb-0">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-orange-950">Day {index + 1}</h3>
                      </div>
                      <p className="text-muted-foreground">{day}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Traveler Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trip.reviews && trip.reviews.length > 0 ? (
                    trip.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {review.user_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-orange-950">{review.user_name}</h4>
                              <div className="flex items-center space-x-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating ? "fill-current text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-orange-950">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No reviews available for this trip yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-950">Book This Trip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-950">₹{(trip.cost ?? 0).toLocaleString()}</p>
                    <p className="text-muted-foreground">per person</p>
                  </div>

                  {isAvailable ? (
                    <BookingModal trip={trip} />
                  ) : (
                    <Button className="w-full" size="lg" disabled>
                      <XCircle className="h-5 w-5 mr-2" />
                      Sold Out
                    </Button>
                  )}

                  <Button variant="outline" className="w-full bg-transparent">
                    Add to Wishlist
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Free cancellation up to 24 hours before departure</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trip Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-950">Trip Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(trip.interests ?? []).map((interest, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{interest} activities included</span>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Professional local guide</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">All meals included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Comfortable accommodation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-950">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Accommodation ({trip.days - 1} nights)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>All meals (breakfast, lunch, dinner)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Transportation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Professional guide</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Entry fees to attractions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">✗</span>
                    <span>International flights</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">✗</span>
                    <span>Travel insurance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
