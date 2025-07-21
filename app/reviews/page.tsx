"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin, Calendar } from "lucide-react"
import { getAllReviews, type Review } from "@/lib/data" // Import getAllReviews and Review type

export default function ReviewsPage() {
  const [allReviews, setAllReviews] = useState<
    (Review & { destination: string; tripDays: number; tripBudget: string })[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedReviews = await getAllReviews()
        // Sort reviews by rating in descending order
        setAllReviews(fetchedReviews.sort((a, b) => b.rating - a.rating))
      } catch (err) {
        console.error("Failed to fetch reviews:", err)
        setError("Failed to load reviews. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/50 py-8 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-brand-black">Traveler Reviews</h1>
          <p className="text-muted-foreground text-lg">
            Read authentic reviews from fellow travelers who used our AI trip planner
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {allReviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No reviews found.</div>
            ) : (
              allReviews.map((review, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {review.user_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-brand-black">{review.user_name}</h3>
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
                        <span className="font-semibold text-brand-black">{review.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{review.comment}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-brand-red/10 text-brand-red">
                        {review.tripBudget}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Trip to {review.destination}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-black">Review Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="font-semibold text-brand-black">
                        {allReviews.length > 0
                          ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Total Reviews</span>
                    <span className="font-semibold text-brand-black">{allReviews.length}</span>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = allReviews.filter((review) => Math.floor(review.rating) === rating).length
                      const percentage = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0

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
                <CardTitle className="text-brand-black">Top Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allReviews.length > 0 ? (
                    Array.from(new Set(allReviews.map((review) => review.destination)))
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
                      })
                  ) : (
                    <p className="text-gray-500 text-sm">No destinations to display.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
