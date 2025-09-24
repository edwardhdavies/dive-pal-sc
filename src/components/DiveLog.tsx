"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, MapPin, X, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import diveSitesData from "../mock/dive_sites.json"

interface DiveLogProps {
  onBack: () => void
  selectedSite?: { id: number; name: string; location: string } | null
}

interface DiveSite {
  id: number
  name: string
  location: string
  description: string
  image_url: string
}

interface SimpleDiveLogEntry {
  site_id: number | null
  site_name: string
  location: string
  date: string
  notes: string
  photos: string[]
}

export default function DiveLog({ onBack, selectedSite }: DiveLogProps) {
  const { toast } = useToast()
  const [photos, setPhotos] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSiteSearch, setShowSiteSearch] = useState(!selectedSite)
  const [selectedDiveSite, setSelectedDiveSite] = useState<DiveSite | null>(
    selectedSite
      ? {
          id: selectedSite.id,
          name: selectedSite.name,
          location: selectedSite.location,
          description: "",
          image_url: "",
        }
      : null,
  )

  const [logEntry, setLogEntry] = useState<SimpleDiveLogEntry>({
    site_id: selectedSite?.id || null,
    site_name: selectedSite?.name || "",
    location: selectedSite?.location || "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    photos: [],
  })

  const filteredSites = diveSitesData.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSiteSelect = (site: DiveSite) => {
    setSelectedDiveSite(site)
    setLogEntry((prev) => ({
      ...prev,
      site_id: site.id,
      site_name: site.name,
      location: site.location,
    }))
    setShowSiteSearch(false)
    setSearchQuery("")
  }

  const handleAddPhoto = () => {
    // In a real app, this would open a file picker
    const newPhoto = `/placeholder.svg?height=200&width=300&query=underwater diving photo ${photos.length + 1}`
    setPhotos((prev) => [...prev, newPhoto])
    setLogEntry((prev) => ({ ...prev, photos: [...prev.photos, newPhoto] }))
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
    setLogEntry((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }

  const handleSaveDive = () => {
    if (!logEntry.site_name) {
      toast({
        title: "Please select a dive site",
        description: "You need to choose a dive site before logging your dive.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save to backend/localStorage
    console.log("Saving dive log:", logEntry)
    toast({
      title: "Dive logged successfully!",
      description: `Your dive at ${logEntry.site_name} has been saved to your log.`,
    })
    onBack()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="ghost" className="text-ocean-600 hover:bg-ocean-50 p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-ocean-900">Log a Dive</h1>
            <p className="text-ocean-600">Record your diving experience</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-ocean-200">
            <CardHeader>
              <CardTitle className="text-ocean-900 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dive Site
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDiveSite && !showSiteSearch ? (
                <div className="flex items-center justify-between p-4 bg-ocean-50 rounded-lg border border-ocean-200">
                  <div>
                    <h3 className="font-semibold text-ocean-900">{selectedDiveSite.name}</h3>
                    <p className="text-ocean-600">{selectedDiveSite.location}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSiteSearch(true)}
                    className="border-ocean-300 text-ocean-700 hover:bg-ocean-100"
                  >
                    Change Site
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-ocean-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      placeholder="Search dive sites by name or location..."
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredSites.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => handleSiteSelect(site)}
                        className="w-full p-3 text-left border border-ocean-200 rounded-lg hover:bg-ocean-50 hover:border-ocean-300 transition-colors"
                      >
                        <div className="font-medium text-ocean-900">{site.name}</div>
                        <div className="text-sm text-ocean-600">{site.location}</div>
                        <div className="text-xs text-ocean-500 mt-1 line-clamp-2">{site.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-ocean-200">
            <CardHeader>
              <CardTitle className="text-ocean-900">Dive Date</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="date"
                value={logEntry.date}
                onChange={(e) => setLogEntry((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-ocean-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              />
            </CardContent>
          </Card>

          <Card className="border-ocean-200">
            <CardHeader>
              <CardTitle className="text-ocean-900 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Dive photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddPhoto}
                  className="h-24 border-2 border-dashed border-ocean-300 rounded-lg flex items-center justify-center text-ocean-600 hover:border-ocean-400 hover:bg-ocean-50"
                >
                  <div className="text-center">
                    <Camera className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">Add Photo</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-ocean-200">
            <CardHeader>
              <CardTitle className="text-ocean-900">Dive Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={logEntry.notes}
                onChange={(e) => setLogEntry((prev) => ({ ...prev, notes: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-ocean-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 resize-none"
                placeholder="Describe your dive experience, what you saw, conditions, highlights, or any other notes..."
              />
            </CardContent>
          </Card>

          <div className="flex justify-center pt-4">
            <Button onClick={handleSaveDive} className="bg-ocean-500 hover:bg-ocean-600 text-white px-8 py-3 text-lg">
              Save Dive Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
