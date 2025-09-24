"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Download, Settings, Trophy, Waves, Camera, Edit3, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import mockSites from "@/src/mock/dive_sites.json"

interface DiveLog {
  id: number
  site_name: string
  location: string
  date: string
  depth: number
  duration: number
  visibility: number
  notes: string
  photos: string[]
}

interface ProfileProps {
  onOpenSettings: () => void
}

export default function Profile({ onOpenSettings }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Chen",
    bio: "Passionate scuba diver exploring the world's oceans. PADI Advanced Open Water certified with 150+ dives.",
    location: "Bali, Indonesia",
    certification: "PADI Advanced Open Water",
    totalDives: 156,
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [editProfile, setEditProfile] = useState(profile)
  const { toast } = useToast()

  // Mock dive logs
  const [diveLogs] = useState<DiveLog[]>([
    {
      id: 1,
      site_name: "Blue Corner",
      location: "Palau",
      date: "2024-01-15",
      depth: 28,
      duration: 45,
      visibility: 30,
      notes: "Amazing dive with hammerhead sharks! Strong current but incredible marine life.",
      photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    },
    {
      id: 2,
      site_name: "Manta Point",
      location: "Nusa Penida",
      date: "2024-01-12",
      depth: 18,
      duration: 50,
      visibility: 25,
      notes: "Three manta rays at the cleaning station. Absolutely magical experience!",
      photos: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: 3,
      site_name: "Crystal Bay",
      location: "Nusa Penida",
      date: "2024-01-10",
      depth: 22,
      duration: 42,
      visibility: 20,
      notes: "Night dive with walking sharks and amazing macro life. Water was a bit cold.",
      photos: [],
    },
  ])

  const handleSaveProfile = () => {
    setProfile(editProfile)
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully",
    })
  }

  const handleExportLogs = () => {
    // Mock CSV export
    const csvContent = diveLogs
      .map(
        (log) =>
          `${log.date},${log.site_name},${log.location},${log.depth}m,${log.duration}min,${log.visibility}m,"${log.notes}"`,
      )
      .join("\n")

    toast({
      title: "Dive logs exported",
      description: "Your dive log CSV has been downloaded",
    })
  }

  const stats = [
    { label: "Total Dives", value: profile.totalDives, icon: Waves },
    { label: "Countries", value: 12, icon: MapPin },
    { label: "Max Depth", value: "42m", icon: Trophy },
    { label: "This Year", value: 28, icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-ocean-900">Profile</h1>
          <Button
            onClick={onOpenSettings}
            variant="outline"
            className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 bg-transparent"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="mb-6 border-ocean-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="bg-ocean-100 text-ocean-700 text-xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 bg-transparent"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-ocean-700">Name</label>
                      <input
                        type="text"
                        value={editProfile.name}
                        onChange={(e) => setEditProfile((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ocean-700">Bio</label>
                      <textarea
                        value={editProfile.bio}
                        onChange={(e) => setEditProfile((prev) => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ocean-700">Location</label>
                      <input
                        type="text"
                        value={editProfile.location}
                        onChange={(e) => setEditProfile((prev) => ({ ...prev, location: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="bg-ocean-500 hover:bg-ocean-600 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditProfile(profile)
                          setIsEditing(false)
                        }}
                        className="border-ocean-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold text-ocean-900">{profile.name}</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-ocean-600 hover:bg-ocean-50"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-ocean-700 mb-3">{profile.bio}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-ocean-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {profile.certification}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-ocean-200">
                <CardContent className="p-4 text-center">
                  <Icon className="w-6 h-6 text-ocean-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-ocean-900">{stat.value}</div>
                  <div className="text-sm text-ocean-600">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-ocean-50">
            <TabsTrigger value="logs" className="data-[state=active]:bg-white data-[state=active]:text-ocean-900">
              Dive Logs
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-white data-[state=active]:text-ocean-900">
              Saved Sites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ocean-900">Recent Dives</h3>
              <Button
                onClick={handleExportLogs}
                variant="outline"
                size="sm"
                className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <div className="space-y-4">
              {diveLogs.map((log) => (
                <Card key={log.id} className="border-ocean-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-ocean-900">{log.site_name}</CardTitle>
                      <Badge variant="outline" className="border-ocean-300 text-ocean-700">
                        {new Date(log.date).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-ocean-600">
                      <MapPin className="w-3 h-3" />
                      {log.location}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-ocean-50 rounded-lg">
                        <div className="font-medium text-ocean-900">{log.depth}m</div>
                        <div className="text-ocean-600">Max Depth</div>
                      </div>
                      <div className="text-center p-2 bg-ocean-50 rounded-lg">
                        <div className="font-medium text-ocean-900">{log.duration}min</div>
                        <div className="text-ocean-600">Duration</div>
                      </div>
                      <div className="text-center p-2 bg-ocean-50 rounded-lg">
                        <div className="font-medium text-ocean-900">{log.visibility}m</div>
                        <div className="text-ocean-600">Visibility</div>
                      </div>
                    </div>

                    {log.notes && <p className="text-ocean-700 text-sm bg-ocean-50 p-3 rounded-lg">{log.notes}</p>}

                    {log.photos.length > 0 && (
                      <div className="flex gap-2">
                        {log.photos.slice(0, 3).map((photo, index) => (
                          <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src={photo || "/placeholder.svg?height=64&width=64&query=underwater diving photo"}
                              alt={`Dive photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {log.photos.length > 3 && (
                          <div className="w-16 h-16 rounded-lg bg-ocean-100 flex items-center justify-center">
                            <span className="text-xs text-ocean-600">+{log.photos.length - 3}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <h3 className="text-lg font-semibold text-ocean-900">Saved Dive Sites</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {mockSites.slice(0, 4).map((site) => (
                <Card key={site.id} className="border-ocean-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={site.image_url || "/placeholder.svg?height=64&width=64&query=coral reef diving site"}
                          alt={site.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-ocean-900">{site.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-ocean-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          {site.location}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {site.marine_life.slice(0, 2).map((animal, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-ocean-100 text-ocean-700">
                              {animal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
