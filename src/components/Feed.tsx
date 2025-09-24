"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Plus, MapPin, Calendar, Camera, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FeedPostSkeleton } from "@/src/components/LoadingStates"
import feedData from "@/src/mock/feed.json"
import mockSites from "@/src/mock/dive_sites.json"

interface FeedPost {
  id: number
  user_id: string
  user_name: string
  user_avatar: string
  site_id: number
  site_name: string
  caption: string
  media: string[]
  created_at: string
  likes_count: number
  comments: Array<{
    id: number
    user_name: string
    comment: string
    created_at: string
  }>
}

interface FeedProps {
  onSiteSelect?: (siteId: number) => void
}

export default function Feed({ onSiteSelect }: FeedProps) {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Added loading state
  const [newPost, setNewPost] = useState({
    caption: "",
    site_id: "",
    media: [] as string[],
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadFeed = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setPosts(feedData)
      setIsLoading(false)
    }
    loadFeed()
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev)
      if (newLiked.has(postId)) {
        newLiked.delete(postId)
      } else {
        newLiked.add(postId)
      }
      return newLiked
    })

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes_count: likedPosts.has(postId) ? post.likes_count - 1 : post.likes_count + 1,
            }
          : post,
      ),
    )
  }

  const handleShare = (post: FeedPost) => {
    toast({
      title: "Post shared",
      description: `${post.user_name}'s dive at ${post.site_name} shared to your timeline`,
    })
  }

  const handleSiteClick = (siteId: number) => {
    if (onSiteSelect) {
      const site = mockSites.find((s) => s.id === siteId)
      if (site) {
        onSiteSelect(siteId)
      }
    }
  }

  const handleCreatePost = () => {
    if (!newPost.caption.trim() || !newPost.site_id) {
      toast({
        title: "Missing information",
        description: "Please add a caption and select a dive site",
        variant: "destructive",
      })
      return
    }

    const site = mockSites.find((s) => s.id === Number(newPost.site_id))
    if (!site) return

    const post: FeedPost = {
      id: posts.length + 1,
      user_id: "current_user",
      user_name: "You",
      user_avatar: "/placeholder.svg?height=40&width=40",
      site_id: Number(newPost.site_id),
      site_name: site.name,
      caption: newPost.caption,
      media: newPost.media.length > 0 ? newPost.media : ["/placeholder.svg?height=300&width=400"],
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments: [],
    }

    setPosts((prev) => [post, ...prev])
    setNewPost({ caption: "", site_id: "", media: [] })
    setShowCreatePost(false)

    toast({
      title: "Post created",
      description: "Your dive experience has been shared with the community",
    })
  }

  const handleAddMedia = () => {
    // Mock adding media
    const mockImage = "/underwater-diving-photo.jpg"
    setNewPost((prev) => ({
      ...prev,
      media: [...prev.media, mockImage],
    }))
    toast({
      title: "Photo added",
      description: "Mock photo uploaded successfully",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-ocean-900">Dive Feed</h1>
          <Button onClick={() => setShowCreatePost(true)} className="bg-ocean-500 hover:bg-ocean-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Share Dive
          </Button>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <Card className="mb-6 border-ocean-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ocean-900">Share Your Dive Experience</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreatePost(false)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-ocean-700">Dive Site</label>
                <select
                  value={newPost.site_id}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, site_id: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                >
                  <option value="">Select a dive site</option>
                  {mockSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} - {site.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-ocean-700">Caption</label>
                <textarea
                  value={newPost.caption}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, caption: e.target.value }))}
                  placeholder="Share your dive experience..."
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddMedia}
                  className="border-ocean-300 bg-transparent"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
                {newPost.media.length > 0 && (
                  <span className="text-sm text-ocean-600">{newPost.media.length} photo(s) added</span>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreatePost} className="flex-1 bg-ocean-500 hover:bg-ocean-600 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Share Post
                </Button>
                <Button variant="outline" onClick={() => setShowCreatePost(false)} className="border-ocean-300">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <FeedPostSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Feed Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="border-ocean-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.user_avatar || "/placeholder.svg"} alt={post.user_name} />
                          <AvatarFallback className="bg-ocean-100 text-ocean-700">
                            {post.user_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-ocean-900">{post.user_name}</h4>
                          <div className="flex items-center gap-2 text-sm text-ocean-600">
                            <Calendar className="w-3 h-3" />
                            {formatTimeAgo(post.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Site Tag */}
                    <div
                      className="flex items-center gap-1 text-sm cursor-pointer hover:text-ocean-700 transition-colors"
                      onClick={() => handleSiteClick(post.site_id)}
                    >
                      <MapPin className="w-3 h-3 text-ocean-500" />
                      <span className="text-ocean-600 hover:underline">{post.site_name}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Caption */}
                    <p className="text-ocean-800 text-pretty">{post.caption}</p>

                    {/* Media */}
                    {post.media.length > 0 && (
                      <div className="grid grid-cols-1 gap-2">
                        {post.media.slice(0, 2).map((mediaUrl, index) => (
                          <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                            <img
                              src={mediaUrl || "/placeholder.svg?height=300&width=400&query=underwater diving scene"}
                              alt={`Dive photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {post.media.length > 2 && index === 1 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-semibold">+{post.media.length - 2} more</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-ocean-100">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`hover:bg-ocean-50 ${likedPosts.has(post.id) ? "text-red-500" : "text-ocean-600"}`}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                          {post.likes_count}
                        </Button>

                        <Button variant="ghost" size="sm" className="text-ocean-600 hover:bg-ocean-50">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments.length}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(post)}
                          className="text-ocean-600 hover:bg-ocean-50"
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-ocean-100">
                        {post.comments.slice(0, 2).map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-ocean-100 text-ocean-700 text-xs">
                                {comment.user_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-ocean-50 rounded-lg px-3 py-2">
                                <span className="font-medium text-ocean-900 text-sm">{comment.user_name}</span>
                                <p className="text-ocean-700 text-sm">{comment.comment}</p>
                              </div>
                              <span className="text-xs text-ocean-500 ml-3">{formatTimeAgo(comment.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        {post.comments.length > 2 && (
                          <Button variant="ghost" size="sm" className="text-ocean-600 text-xs">
                            View all {post.comments.length} comments
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 bg-transparent">
                Load More Posts
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
