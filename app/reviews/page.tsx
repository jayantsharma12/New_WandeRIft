import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin, Calendar } from "lucide-react"
import { trips } from "@/lib/data"

export default function ReviewsPage() {
  const allReviews = trips
    .flatMap((trip) =>
      trip.reviews.map((review) => ({
        ...review,
        tripId: trip.id,
        destination: trip.destination,
        tripDays: trip.days,
        tripBudget: trip.budget,
      })),
    )
    .sort((a, b) => b.rating - a.rating)

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Traveler Reviews</h1>
          <p className="text-muted-foreground text-lg">
            Read authentic reviews from fellow travelers who used our AI trip planner
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {allReviews.map((review, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {review.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{review.user}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{review.destination}</span>
                          <Calendar className="h-3 w-3 ml-2" />
                          <span>{review.tripDays} days</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
                      <span className="font-semibold">{review.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{review.comment}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{review.tripBudget}</Badge>
                    <span className="text-sm text-muted-foreground">Trip to {review.destination}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="font-semibold">
                        {(allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Total Reviews</span>
                    <span className="font-semibold">{allReviews.length}</span>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = allReviews.filter((review) => Math.floor(review.rating) === rating).length
                      const percentage = (count / allReviews.length) * 100

                      return (
                        <div key={rating} className="flex items-center space-x-2">
                          <span className="text-sm w-8">{rating}★</span>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(allReviews.map((review) => review.destination)))
                    .slice(0, 5)
                    .map((destination) => {
                      const destinationReviews = allReviews.filter((review) => review.destination === destination)
                      const avgRating =
                        destinationReviews.reduce((sum, review) => sum + review.rating, 0) / destinationReviews.length

                      return (
                        <div key={destination} className="flex justify-between items-center">
                          <span className="font-medium">{destination}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            <span className="text-sm">{avgRating.toFixed(1)}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
