"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Eye, Thermometer, Waves, BookmarkPlus, RotateCcw, ArrowRight } from "lucide-react"
import Image from "next/image"
import { SiteCardSkeleton } from "@/src/components/LoadingStates"

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

interface ResultsProps {
  sites: DiveSite[]
  onReset: () => void
  onSaveToLog: (site: DiveSite) => void
  onSiteSelect?: (site: DiveSite) => void
  isLoading?: boolean // Added loading prop
}

export default function Results({ sites, onReset, onSaveToLog, onSiteSelect, isLoading = false }: ResultsProps) {
  const [savedSites, setSavedSites] = useState<Set<number>>(new Set())

  const handleSave = (site: DiveSite) => {
    setSavedSites((prev) => new Set([...prev, site.id]))
    onSaveToLog(site)
  }

  const handleViewSite = (site: DiveSite) => {
    if (onSiteSelect) {
      onSiteSelect(site)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <div className="h-8 bg-ocean-100 rounded-lg w-48 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-ocean-100 rounded w-64 mx-auto animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <SiteCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (sites.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="text-center p-8 float-animation bg-white/90 backdrop-blur-sm border-ocean-200">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto">
              <Waves className="w-8 h-8 text-ocean-600" />
            </div>
            <h3 className="text-xl font-semibold text-ocean-900">No dive sites found</h3>
            <p className="text-ocean-600">
              We couldn't find any dive sites matching your preferences. Try relaxing some filters or use "any" for more
              options.
            </p>
            <Button onClick={onReset} className="mt-4 bg-ocean-500 hover:bg-ocean-600 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Search Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2 text-ocean-900">Search Results</h2>
        <p className="text-ocean-600">
          Found {sites.length} dive site{sites.length !== 1 ? "s" : ""} matching your preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sites.map((site, index) => (
          <Card
            key={site.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 float-animation border-0 bg-white/95 backdrop-blur-sm border border-ocean-200 hover:border-ocean-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={site.image_url || "/placeholder.svg?height=200&width=400&query=underwater coral reef scene"}
                alt={site.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Badge
                  variant="secondary"
                  className={`backdrop-blur-sm ${
                    site.entry_difficulty === "beginner"
                      ? "bg-green-100/80 text-green-700"
                      : site.entry_difficulty === "intermediate"
                        ? "bg-yellow-100/80 text-yellow-700"
                        : "bg-red-100/80 text-red-700"
                  }`}
                >
                  {site.entry_difficulty}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-balance text-ocean-900">{site.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-ocean-600 mt-1">
                    <MapPin className="w-3 h-3" />
                    {site.location}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-ocean-700 text-pretty line-clamp-2">{site.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 p-2 bg-ocean-50 rounded-lg">
                  <Thermometer className="w-4 h-4 text-ocean-600" />
                  <span className="text-ocean-800">
                    {site.temp_min}-{site.temp_max}°C
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-ocean-50 rounded-lg">
                  <Eye className="w-4 h-4 text-ocean-600" />
                  <span className="text-ocean-800">{site.visibility_min}m min</span>
                </div>
              </div>

              <div className="space-y-2">
                {site.marine_life.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {site.marine_life.slice(0, 3).map((animal) => (
                      <Badge key={animal} variant="outline" className="text-xs border-ocean-300 text-ocean-700">
                        {animal}
                      </Badge>
                    ))}
                    {site.marine_life.length > 3 && (
                      <Badge variant="outline" className="text-xs border-ocean-300 text-ocean-700">
                        +{site.marine_life.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {site.site_type.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {site.site_type.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs bg-seafoam-100 text-seafoam-700">
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {onSiteSelect && (
                  <Button
                    onClick={() => handleViewSite(site)}
                    className="flex-1 bg-ocean-500 hover:bg-ocean-600 text-white ripple-effect"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    View Site
                  </Button>
                )}
                <Button
                  onClick={() => handleSave(site)}
                  disabled={savedSites.has(site.id)}
                  className={`${onSiteSelect ? "flex-none" : "w-full"} ripple-effect`}
                  variant={savedSites.has(site.id) ? "outline" : "secondary"}
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  {savedSites.has(site.id) ? "Saved" : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 bg-transparent"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Search Again
        </Button>
      </div>
    </div>
  )
}
