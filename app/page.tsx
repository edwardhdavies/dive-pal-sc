"use client"

import { useState, useEffect } from "react"
import Navigation from "@/src/components/Navigation"
import AuthModal from "@/src/components/AuthModal"
import ChatFlow from "@/src/components/ChatFlow"
import Results from "@/src/components/Results"
import SiteSummary from "@/src/components/SiteSummary"
import MapView from "@/src/components/MapView"
import Feed from "@/src/components/Feed"
import Profile from "@/src/components/Profile"
import Settings from "@/src/components/Settings"
import Tools from "@/src/components/Tools"
import SupabaseToggle from "@/src/components/SupabaseToggle"
import DiveLog from "@/src/components/DiveLog"
import mockData from "@/src/mock/dive_sites.json"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  temp_min?: number
  temp_max?: number
  marine_life: string[]
  coral_type: string[]
  visibility_min?: number
  site_type: string[]
  access_type?: string
  entry_difficulty?: string
}

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

interface User {
  id: string
  name: string
  email: string
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<string>("chatbot")
  const [currentView, setCurrentView] = useState<"form" | "results">("form")
  const [selectedSite, setSelectedSite] = useState<DiveSite | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number } | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showDiveLog, setShowDiveLog] = useState(false)
  const [diveLogSite, setDiveLogSite] = useState<{ id: number; name: string; location: string } | null>(null)

  const [searchResults, setSearchResults] = useState<DiveSite[]>([])
  const [useSupabase, setUseSupabase] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle")
  const [error, setError] = useState<string>()
  const [isSearching, setIsSearching] = useState(false) // Added search loading state
  const { toast } = useToast()

  useEffect(() => {
    const savedUrl = localStorage.getItem("supabase_url")
    const savedKey = localStorage.getItem("supabase_key")
    const savedUseSupabase = localStorage.getItem("use_supabase") === "true"
    const savedUser = localStorage.getItem("dive_buddy_user")

    if (savedUrl) setSupabaseUrl(savedUrl)
    if (savedKey) setSupabaseKey(savedKey)
    setUseSupabase(savedUseSupabase)

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem("dive_buddy_user")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("supabase_url", supabaseUrl)
    localStorage.setItem("supabase_key", supabaseKey)
    localStorage.setItem("use_supabase", useSupabase.toString())
  }, [supabaseUrl, supabaseKey, useSupabase])

  useEffect(() => {
    if (user) {
      localStorage.setItem("dive_buddy_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("dive_buddy_user")
    }
  }, [user])

  const searchSupabase = async (formData: FormData): Promise<DiveSite[]> => {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL and key are required")
    }

    setConnectionStatus("connecting")

    const payload = {
      p_temp_min: formData.temp_min || null,
      p_temp_max: formData.temp_max || null,
      p_marine_life: formData.marine_life.length > 0 ? formData.marine_life : null,
      p_coral_type: formData.coral_type.length > 0 ? formData.coral_type : null,
      p_visibility_min: formData.visibility_min || null,
      p_site_type: formData.site_type.length > 0 ? formData.site_type : null,
      p_access_type: formData.access_type || null,
      p_entry_difficulty: formData.entry_difficulty || null,
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/search_dive_sites_json`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p: payload }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setConnectionStatus("connected")
      setError(undefined)
      return data
    } catch (err) {
      setConnectionStatus("error")
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Supabase search failed:", err)
      throw err
    }
  }

  const searchMockData = (formData: FormData): DiveSite[] => {
    return mockData.filter((site) => {
      if (formData.temp_min && site.temp_max < formData.temp_min) return false
      if (formData.temp_max && site.temp_min > formData.temp_max) return false

      if (formData.visibility_min && site.visibility_min < formData.visibility_min) return false

      if (formData.marine_life.length > 0) {
        const hasMarineLife = formData.marine_life.some((animal) =>
          site.marine_life.some((siteAnimal) => siteAnimal.toLowerCase().includes(animal.toLowerCase())),
        )
        if (!hasMarineLife) return false
      }

      if (formData.coral_type.length > 0) {
        const hasCoralType = formData.coral_type.some((coral) =>
          site.coral_type.some((siteCoral) => siteCoral.toLowerCase().includes(coral.toLowerCase())),
        )
        if (!hasCoralType) return false
      }

      if (formData.site_type.length > 0) {
        const hasSiteType = formData.site_type.some((type) =>
          site.site_type.some((siteType) => siteType.toLowerCase().includes(type.toLowerCase())),
        )
        if (!hasSiteType) return false
      }

      if (formData.access_type && formData.access_type !== "any" && site.access_type !== formData.access_type)
        return false

      if (formData.entry_difficulty && site.entry_difficulty !== formData.entry_difficulty) return false

      return true
    })
  }

  const handleFormComplete = async (formData: FormData) => {
    try {
      setIsSearching(true) // Set loading state
      let results: DiveSite[]

      if (useSupabase && supabaseUrl && supabaseKey) {
        try {
          results = await searchSupabase(formData)
          toast({
            title: "Search completed",
            description: "Results loaded from Supabase",
          })
        } catch (err) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          results = searchMockData(formData)
          toast({
            title: "Using mock data",
            description: "Supabase connection failed, showing mock results",
            variant: "destructive",
          })
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        results = searchMockData(formData)
        toast({
          title: "Search completed",
          description: "Results loaded from mock data",
        })
      }

      setSearchResults(results)
      setCurrentView("results")
    } catch (err) {
      console.error("Search failed:", err)
      toast({
        title: "Search failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false) // Clear loading state
    }
  }

  const handleReset = () => {
    setCurrentView("form")
    setSearchResults([])
    setConnectionStatus("idle")
    setError(undefined)
  }

  const handleSaveToLog = (site: DiveSite) => {
    setDiveLogSite({ id: site.id, name: site.name, location: site.location })
    setShowDiveLog(true)
  }

  const handleOpenDiveLog = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setDiveLogSite(null)
    setShowDiveLog(true)
  }

  const handleCloseDiveLog = () => {
    setShowDiveLog(false)
    setDiveLogSite(null)
  }

  const handleScreenChange = (screen: string) => {
    if (!user && (screen === "profile" || screen === "feed" || screen === "tools")) {
      setShowAuthModal(true)
      return
    }

    setCurrentScreen(screen)
    setSelectedSite(null)
    setMapCenter(null)
    setShowSettings(false)
  }

  const handleSiteSelect = (site: DiveSite) => {
    setSelectedSite(site)
  }

  const handleBackToResults = () => {
    setSelectedSite(null)
  }

  const handleOpenMap = (lat: number, lon: number) => {
    setMapCenter({ lat, lon })
    setCurrentScreen("map")
  }

  const handleFeedSiteSelect = (siteId: number) => {
    const site = mockData.find((s) => s.id === siteId)
    if (site) {
      setSelectedSite(site)
    }
  }

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentScreen("chatbot")
    toast({
      title: "Signed out",
      description: "You've been successfully signed out",
    })
  }

  const renderCurrentScreen = () => {
    if (showDiveLog) {
      return <DiveLog onBack={handleCloseDiveLog} selectedSite={diveLogSite} />
    }

    if (showSettings) {
      return (
        <Settings
          onBack={() => setShowSettings(false)}
          useSupabase={useSupabase}
          onToggleSupabase={setUseSupabase}
          supabaseUrl={supabaseUrl}
          supabaseKey={supabaseKey}
          onUrlChange={setSupabaseUrl}
          onKeyChange={setSupabaseKey}
          connectionStatus={connectionStatus}
          error={error}
        />
      )
    }

    if (selectedSite) {
      return <SiteSummary site={selectedSite} onBack={handleBackToResults} onOpenMap={handleOpenMap} />
    }

    switch (currentScreen) {
      case "chatbot":
        return (
          <div className="min-h-screen ocean-bg p-4 pt-20 md:pt-24 pb-20 md:pb-8">
            <div className="container mx-auto py-8">
              {currentView === "form" && (
                <div className="space-y-6">
                  <SupabaseToggle
                    useSupabase={useSupabase}
                    onToggle={setUseSupabase}
                    supabaseUrl={supabaseUrl}
                    supabaseKey={supabaseKey}
                    onUrlChange={setSupabaseUrl}
                    onKeyChange={setSupabaseKey}
                    connectionStatus={connectionStatus}
                    error={error}
                  />
                  <ChatFlow onComplete={handleFormComplete} />
                </div>
              )}

              {currentView === "results" && (
                <Results
                  sites={searchResults}
                  onReset={handleReset}
                  onSaveToLog={handleSaveToLog}
                  onSiteSelect={handleSiteSelect}
                  isLoading={isSearching} // Pass loading state to Results
                />
              )}
            </div>
          </div>
        )

      case "map":
        return (
          <div className="pt-16 md:pt-16">
            <MapView onSiteSelect={handleSiteSelect} centerLat={mapCenter?.lat} centerLon={mapCenter?.lon} />
          </div>
        )

      case "feed":
        return (
          <div className="pt-16 md:pt-16">
            <Feed onSiteSelect={handleFeedSiteSelect} />
          </div>
        )

      case "tools":
        return <Tools />

      case "profile":
        return (
          <div className="pt-16 md:pt-16">
            <Profile onOpenSettings={() => setShowSettings(true)} />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation
        currentScreen={currentScreen}
        onScreenChange={handleScreenChange}
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenDiveLog={handleOpenDiveLog}
      />
      {renderCurrentScreen()}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />
    </main>
  )
}
