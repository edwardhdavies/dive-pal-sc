"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MapPin,
  Thermometer,
  Eye,
  Waves,
  Calendar,
  Heart,
  Share2,
  Star,
  MessageSquare,
  Plus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DiveSite {
  id: number
  name: string
  location: string
  lat: number
  lon: number
  temp_min: number
  temp_max: number
  marine_life: string[]
  coral_type: string[]
  visibility_min: number
  site_type: string[]
  access_type: string
  entry_difficulty: string
  description: string
  image_url: string
}

interface Review {
  id: number
  user: {
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  date: string
  helpful: number
}

interface SiteSummaryProps {
  site: DiveSite
  onBack: () => void
  onOpenMap: (lat: number, lon: number) => void
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: 1,
    user: { name: "Sarah Chen", avatar: "/placeholder.svg" },
    rating: 5,
    comment:
      "Absolutely incredible dive site! The coral formations are pristine and the marine life is abundant. Saw several sea turtles and a reef shark. Visibility was excellent at 25m+. Perfect for intermediate divers.",
    date: "2024-01-15",
    helpful: 12,
  },
  {
    id: 2,
    user: { name: "Mike Rodriguez" },
    rating: 4,
    comment:
      "Great site with beautiful coral gardens. The current can be a bit strong, so definitely recommend for intermediate+ divers. Amazing macro photography opportunities!",
    date: "2024-01-10",
    helpful: 8,
  },
  {
    id: 3,
    user: { name: "Emma Thompson" },
    rating: 5,
    comment:
      "One of the best dives of my life! The biodiversity here is incredible. Spotted octopus, moray eels, and countless tropical fish species. Will definitely return!",
    date: "2024-01-05",
    helpful: 15,
  },
]

export default function SiteSummary({ site, onBack, onOpenMap }: SiteSummaryProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" })
  const { toast } = useToast()

  const handleMarkCompleted = () => {
    setIsCompleted(!isCompleted)
    toast({
      title: isCompleted ? "Removed from completed dives" : "Marked as completed",
      description: isCompleted
        ? `${site.name} removed from your dive log`
        : `${site.name} added to your completed dives`,
    })
  }

  const handleLogDive = () => {
    setShowLogModal(true)
    // Mock dive logging
    setTimeout(() => {
      setShowLogModal(false)
      toast({
        title: "Dive logged successfully",
        description: `Your dive at ${site.name} has been recorded`,
      })
    }, 1500)
  }

  const handleShare = () => {
    toast({
      title: "Site shared",
      description: `${site.name} link copied to clipboard`,
    })
  }

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      toast({
        title: "Review incomplete",
        description: "Please provide both a rating and comment",
        variant: "destructive",
      })
      return
    }

    const review: Review = {
      id: reviews.length + 1,
      user: { name: "You" },
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    }

    setReviews([review, ...reviews])
    setNewReview({ rating: 0, comment: "" })
    setShowReviewForm(false)

    toast({
      title: "Review submitted",
      description: "Thank you for sharing your experience!",
    })
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const StarRating = ({
    rating,
    interactive = false,
    onRatingChange,
  }: {
    rating: number
    interactive?: boolean
    onRatingChange?: (rating: number) => void
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-ocean-200 px-4 py-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-ocean-600">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-ocean-900 truncate">{site.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Image Carousel */}
        <Card className="overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img src={site.image_url || "/placeholder.svg"} alt={site.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant={isCompleted ? "default" : "secondary"} onClick={handleMarkCompleted}>
                <Heart className={`w-4 h-4 ${isCompleted ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Site Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ocean-900">
              <MapPin className="w-5 h-5 text-ocean-600" />
              {site.location}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-ocean-700">{site.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-ocean-50 rounded-lg">
                <Thermometer className="w-4 h-4 text-ocean-600" />
                <div>
                  <div className="text-sm font-medium text-ocean-900">Temperature</div>
                  <div className="text-xs text-ocean-600">
                    {site.temp_min}°C - {site.temp_max}°C
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-ocean-50 rounded-lg">
                <Eye className="w-4 h-4 text-ocean-600" />
                <div>
                  <div className="text-sm font-medium text-ocean-900">Visibility</div>
                  <div className="text-xs text-ocean-600">{site.visibility_min}m+</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-ocean-50 rounded-lg">
                <Waves className="w-4 h-4 text-ocean-600" />
                <div>
                  <div className="text-sm font-medium text-ocean-900">Access</div>
                  <div className="text-xs text-ocean-600 capitalize">{site.access_type}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-ocean-50 rounded-lg">
                <div className="w-4 h-4 bg-ocean-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {site.entry_difficulty === "beginner" ? "B" : site.entry_difficulty === "intermediate" ? "I" : "A"}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-ocean-900">Difficulty</div>
                  <div className="text-xs text-ocean-600 capitalize">{site.entry_difficulty}</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-ocean-900 mb-2">Marine Life</h4>
                <div className="flex flex-wrap gap-2">
                  {site.marine_life.map((animal, index) => (
                    <Badge key={index} variant="secondary" className="bg-ocean-100 text-ocean-700">
                      {animal}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-ocean-900 mb-2">Coral Types</h4>
                <div className="flex flex-wrap gap-2">
                  {site.coral_type.map((coral, index) => (
                    <Badge key={index} variant="secondary" className="bg-seafoam-100 text-seafoam-700">
                      {coral}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-ocean-900 mb-2">Site Types</h4>
                <div className="flex flex-wrap gap-2">
                  {site.site_type.map((type, index) => (
                    <Badge key={index} variant="outline" className="border-ocean-300 text-ocean-700">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-ocean-900">
                <MessageSquare className="w-5 h-5 text-ocean-600" />
                Reviews ({reviews.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <StarRating rating={Number(calculateAverageRating())} />
                <span className="text-sm text-ocean-600">
                  {calculateAverageRating()} ({reviews.length} reviews)
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Review Button */}
            {!showReviewForm && (
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(true)}
                className="w-full border-ocean-300 text-ocean-700 hover:bg-ocean-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <Card className="border-ocean-200">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-ocean-900 mb-2 block">Your Rating</label>
                    <StarRating
                      rating={newReview.rating}
                      interactive
                      onRatingChange={(rating) => setNewReview((prev) => ({ ...prev, rating }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ocean-900 mb-2 block">Your Review</label>
                    <Textarea
                      placeholder="Share your diving experience at this site..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                      className="min-h-[100px] border-ocean-200 focus:ring-ocean-500 focus:border-ocean-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSubmitReview} className="bg-ocean-500 hover:bg-ocean-600 text-white">
                      Submit Review
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReviewForm(false)
                        setNewReview({ rating: 0, comment: "" })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="border-ocean-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                        <AvatarFallback className="bg-ocean-100 text-ocean-700">
                          {review.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-ocean-900">{review.user.name}</p>
                            <div className="flex items-center gap-2">
                              <StarRating rating={review.rating} />
                              <span className="text-sm text-ocean-600">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-ocean-700 text-sm leading-relaxed">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm text-ocean-500">
                          <button className="hover:text-ocean-700 transition-colors">Helpful ({review.helpful})</button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleLogDive}
            disabled={showLogModal}
            className="flex-1 bg-ocean-500 hover:bg-ocean-600 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {showLogModal ? "Logging..." : "Log a Dive"}
          </Button>

          <Button
            variant="outline"
            onClick={() => onOpenMap(site.lat, site.lon)}
            className="flex-1 border-ocean-300 text-ocean-700 hover:bg-ocean-50"
          >
            <MapPin className="w-4 h-4 mr-2" />
            View on Map
          </Button>
        </div>

        {/* Map Thumbnail */}
        <Card>
          <CardContent className="p-4">
            <div
              className="h-32 bg-ocean-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-ocean-200 transition-colors"
              onClick={() => onOpenMap(site.lat, site.lon)}
            >
              <div className="text-center">
                <MapPin className="w-8 h-8 text-ocean-600 mx-auto mb-2" />
                <p className="text-sm text-ocean-700">Click to view full map</p>
                <p className="text-xs text-ocean-500">
                  {site.lat.toFixed(4)}, {site.lon.toFixed(4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
