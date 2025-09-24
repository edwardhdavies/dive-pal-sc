"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Filter, X, Layers, ZoomIn, ZoomOut, Navigation } from "lucide-react"
import mockData from "@/src/mock/dive_sites.json"

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

interface MapViewProps {
  onSiteSelect: (site: DiveSite) => void
  centerLat?: number
  centerLon?: number
}

export default function MapView({ onSiteSelect, centerLat, centerLon }: MapViewProps) {
  const [sites] = useState<DiveSite[]>(mockData)
  const [selectedSite, setSelectedSite] = useState<DiveSite | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [mapStyle, setMapStyle] = useState<"satellite" | "terrain">("satellite")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [filters, setFilters] = useState({
    marine_life: "",
    difficulty: "",
    visibility: 0,
    site_type: "",
  })

  // Center map on specific coordinates if provided
  useEffect(() => {
    if (centerLat && centerLon) {
      // Find the site closest to these coordinates
      const targetSite = sites.find(
        (site) => Math.abs(site.lat - centerLat) < 0.1 && Math.abs(site.lon - centerLon) < 0.1,
      )
      if (targetSite) {
        setSelectedSite(targetSite)
        setZoomLevel(2)
      }
    }
  }, [centerLat, centerLon, sites])

  const filteredSites = sites.filter((site) => {
    if (
      filters.marine_life &&
      !site.marine_life.some((animal) => animal.toLowerCase().includes(filters.marine_life.toLowerCase()))
    )
      return false

    if (filters.difficulty && site.entry_difficulty !== filters.difficulty) return false

    if (filters.visibility && site.visibility_min < filters.visibility) return false

    if (
      filters.site_type &&
      !site.site_type.some((type) => type.toLowerCase().includes(filters.site_type.toLowerCase()))
    )
      return false

    return true
  })

  const handleMarkerClick = (site: DiveSite) => {
    setSelectedSite(site)
    setZoomLevel(Math.max(zoomLevel, 1.5))
  }

  const handleViewSite = (site: DiveSite) => {
    onSiteSelect(site)
  }

  const clearFilters = () => {
    setFilters({ marine_life: "", difficulty: "", visibility: 0, site_type: "" })
  }

  const getMarkerPosition = (site: DiveSite, index: number) => {
    // More realistic positioning based on actual coordinates
    // Normalize coordinates to percentage positions
    const latRange = { min: -10, max: 10 } // Rough tropical diving range
    const lonRange = { min: 110, max: 140 } // Indo-Pacific region

    const normalizedLat = ((site.lat - latRange.min) / (latRange.max - latRange.min)) * 100
    const normalizedLon = ((site.lon - lonRange.min) / (lonRange.max - lonRange.min)) * 100

    // Clamp to visible area with some padding
    const left = Math.max(5, Math.min(95, normalizedLon))
    const top = Math.max(5, Math.min(95, 100 - normalizedLat)) // Invert Y axis

    return { left: `${left}%`, top: `${top}%` }
  }

  return (
    <div className="h-screen bg-ocean-50 relative overflow-hidden">
      {/* Map Container */}
      <div className="h-full relative">
        {/* Map Background */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            mapStyle === "satellite"
              ? "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
              : "bg-gradient-to-br from-green-300 via-blue-400 to-blue-600"
          }`}
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
        >
          {/* Ocean texture overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-gradient-radial from-transparent via-blue-300/20 to-blue-600/40"></div>
          </div>

          {/* Depth contours */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute border border-blue-300/30 rounded-full"
                style={{
                  width: `${(i + 1) * 20}%`,
                  height: `${(i + 1) * 20}%`,
                  left: `${40 - (i + 1) * 10}%`,
                  top: `${40 - (i + 1) * 10}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Map Markers */}
        <div className="absolute inset-0 overflow-hidden">
          {filteredSites.map((site, index) => {
            const position = getMarkerPosition(site, index)
            return (
              <div
                key={site.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300"
                style={{
                  left: position.left,
                  top: position.top,
                  transform: `translate(-50%, -50%) scale(${zoomLevel})`,
                }}
                onClick={() => handleMarkerClick(site)}
              >
                <div className="relative">
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-125 transition-all duration-200 ${
                      site.entry_difficulty === "beginner"
                        ? "bg-green-500"
                        : site.entry_difficulty === "intermediate"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    } ${selectedSite?.id === site.id ? "ring-4 ring-white/50 scale-125" : ""}`}
                  >
                    <MapPin className="w-3 h-3 text-white" />
                  </div>

                  {/* Site popup */}
                  {selectedSite?.id === site.id && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 animate-in fade-in slide-in-from-top-2">
                      <Card className="w-72 shadow-xl border-ocean-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-ocean-900 text-sm">{site.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedSite(null)
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>

                          <p className="text-xs text-ocean-600 mb-2">{site.location}</p>

                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-ocean-500">Temp:</span>
                              <span className="text-ocean-800">
                                {site.temp_min}-{site.temp_max}°C
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-ocean-500">Vis:</span>
                              <span className="text-ocean-800">{site.visibility_min}m+</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {site.marine_life.slice(0, 3).map((animal, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-ocean-100 text-ocean-700">
                                {animal}
                              </Badge>
                            ))}
                            {site.marine_life.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-ocean-100 text-ocean-700">
                                +{site.marine_life.length - 3}
                              </Badge>
                            )}
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleViewSite(site)}
                            className="w-full bg-ocean-500 hover:bg-ocean-600 text-white text-xs"
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          {/* Layer Toggle */}
          <Button
            onClick={() => setMapStyle(mapStyle === "satellite" ? "terrain" : "satellite")}
            className="bg-white/90 text-ocean-700 hover:bg-white border border-ocean-200 shadow-lg"
            size="sm"
          >
            <Layers className="w-4 h-4 mr-2" />
            {mapStyle === "satellite" ? "Terrain" : "Satellite"}
          </Button>

          {/* Filter Button */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/90 text-ocean-700 hover:bg-white border border-ocean-200 shadow-lg"
            size="sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(filters.marine_life || filters.difficulty || filters.visibility || filters.site_type) && (
              <span className="ml-1 w-2 h-2 bg-ocean-500 rounded-full"></span>
            )}
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-1">
          <Button
            onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
            className="bg-white/90 text-ocean-700 hover:bg-white border border-ocean-200 shadow-lg w-10 h-10 p-0"
            disabled={zoomLevel >= 3}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}
            className="bg-white/90 text-ocean-700 hover:bg-white border border-ocean-200 shadow-lg w-10 h-10 p-0"
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="absolute top-16 right-4 z-30">
            <Card className="w-64 shadow-xl border-ocean-200">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-ocean-900">Map Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="h-6 w-6 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium text-ocean-700">Marine Life</label>
                  <input
                    type="text"
                    placeholder="e.g. turtles, sharks"
                    value={filters.marine_life}
                    onChange={(e) => setFilters((prev) => ({ ...prev, marine_life: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-ocean-700">Site Type</label>
                  <input
                    type="text"
                    placeholder="e.g. reef, wreck"
                    value={filters.site_type}
                    onChange={(e) => setFilters((prev) => ({ ...prev, site_type: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-ocean-700">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  >
                    <option value="">Any Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-ocean-700">Min Visibility (m)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.visibility || ""}
                    onChange={(e) => setFilters((prev) => ({ ...prev, visibility: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full border-ocean-300 text-ocean-700 hover:bg-ocean-50 bg-transparent"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-30">
          <Card className="bg-white/90 backdrop-blur-sm border-ocean-200">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-ocean-700">
                  <span className="font-medium">Dive Sites ({filteredSites.length})</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-ocean-600">Beginner</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-ocean-600">Intermediate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-ocean-600">Advanced</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compass */}
        <div className="absolute top-4 left-4 z-30">
          <Card className="bg-white/90 backdrop-blur-sm border-ocean-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-center">
                <Navigation className="w-6 h-6 text-ocean-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
