"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Database, Bell, Shield, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SettingsProps {
  onBack: () => void
  useSupabase: boolean
  onToggleSupabase: (enabled: boolean) => void
  supabaseUrl: string
  supabaseKey: string
  onUrlChange: (url: string) => void
  onKeyChange: (key: string) => void
  connectionStatus: "idle" | "connecting" | "connected" | "error"
  error?: string
}

export default function Settings({
  onBack,
  useSupabase,
  onToggleSupabase,
  supabaseUrl,
  supabaseKey,
  onUrlChange,
  onKeyChange,
  connectionStatus,
  error,
}: SettingsProps) {
  const [settings, setSettings] = useState({
    notifications: {
      newPosts: true,
      diveReminders: false,
      weatherAlerts: true,
      communityUpdates: false,
    },
    privacy: {
      profileVisible: true,
      showLocation: true,
      shareStats: false,
    },
    preferences: {
      units: "metric",
      language: "en",
      theme: "light",
    },
  })

  const { toast } = useToast()

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    })
  }

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Missing credentials",
        description: "Please enter both Supabase URL and API key",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Connection successful",
          description: "Successfully connected to Supabase",
        })
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (err) {
      toast({
        title: "Connection failed",
        description: "Unable to connect to Supabase. Please check your credentials.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-ocean-600">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-ocean-900">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Database Integration */}
          <Card className="border-ocean-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-900">
                <Database className="w-5 h-5 text-ocean-600" />
                Database Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-ocean-900">Use Live Supabase</h4>
                  <p className="text-sm text-ocean-600">Connect to your Supabase database for live data</p>
                </div>
                <Switch checked={useSupabase} onCheckedChange={onToggleSupabase} />
              </div>

              {useSupabase && (
                <div className="space-y-4 pt-4 border-t border-ocean-200">
                  <div>
                    <label className="text-sm font-medium text-ocean-700">Supabase URL</label>
                    <input
                      type="url"
                      placeholder="https://your-project.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => onUrlChange(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-ocean-700">API Key (Publishable)</label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKey}
                      onChange={(e) => onKeyChange(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    />
                    <p className="text-xs text-ocean-500 mt-1">
                      Never paste your service_role key here. Only use the publishable anon key.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleTestConnection}
                      variant="outline"
                      size="sm"
                      className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 bg-transparent"
                    >
                      Test Connection
                    </Button>
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          connectionStatus === "connected"
                            ? "bg-green-500"
                            : connectionStatus === "error"
                              ? "bg-red-500"
                              : connectionStatus === "connecting"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                        }`}
                      />
                      <span className="text-ocean-600">
                        {connectionStatus === "connected"
                          ? "Connected"
                          : connectionStatus === "error"
                            ? "Error"
                            : connectionStatus === "connecting"
                              ? "Connecting..."
                              : "Not connected"}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-ocean-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-900">
                <Bell className="w-5 h-5 text-ocean-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-ocean-900 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</h4>
                    <p className="text-sm text-ocean-600">
                      {key === "newPosts" && "Get notified when divers share new experiences"}
                      {key === "diveReminders" && "Reminders for planned dives and certifications"}
                      {key === "weatherAlerts" && "Weather and sea condition updates"}
                      {key === "communityUpdates" && "Updates from the diving community"}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, [key]: checked },
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="border-ocean-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-900">
                <Shield className="w-5 h-5 text-ocean-600" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-ocean-900 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</h4>
                    <p className="text-sm text-ocean-600">
                      {key === "profileVisible" && "Make your profile visible to other divers"}
                      {key === "showLocation" && "Display your location on your profile"}
                      {key === "shareStats" && "Share your diving statistics publicly"}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        privacy: { ...prev.privacy, [key]: checked },
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="border-ocean-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-900">
                <Palette className="w-5 h-5 text-ocean-600" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-ocean-700">Units</label>
                <select
                  value={settings.preferences.units}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: { ...prev.preferences, units: e.target.value },
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                >
                  <option value="metric">Metric (meters, Celsius)</option>
                  <option value="imperial">Imperial (feet, Fahrenheit)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-ocean-700">Language</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: { ...prev.preferences, language: e.target.value },
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="id">Bahasa Indonesia</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-ocean-700">Theme</label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: { ...prev.preferences, theme: e.target.value },
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSaveSettings} className="w-full bg-ocean-500 hover:bg-ocean-600 text-white">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
