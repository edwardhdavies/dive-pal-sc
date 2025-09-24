"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, AlertCircle } from "lucide-react"

interface SupabaseToggleProps {
  useSupabase: boolean
  onToggle: (enabled: boolean) => void
  supabaseUrl: string
  supabaseKey: string
  onUrlChange: (url: string) => void
  onKeyChange: (key: string) => void
  connectionStatus: "idle" | "connecting" | "connected" | "error"
  error?: string
}

export default function SupabaseToggle({
  useSupabase,
  onToggle,
  supabaseUrl,
  supabaseKey,
  onUrlChange,
  onKeyChange,
  connectionStatus,
  error,
}: SupabaseToggleProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Source
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="supabase-toggle">Use Live Supabase</Label>
            <p className="text-sm text-muted-foreground">Toggle between mock data and live Supabase integration</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="supabase-toggle" checked={useSupabase} onCheckedChange={onToggle} />
            <Badge variant={useSupabase ? "default" : "secondary"}>{useSupabase ? "Live" : "Mock"}</Badge>
          </div>
        </div>

        {connectionStatus === "connected" && useSupabase && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Connected to Supabase
          </div>
        )}

        {connectionStatus === "error" && useSupabase && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            Connection failed - using mock data
          </div>
        )}

        {showSettings && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="supabase-url">Supabase URL</Label>
              <Input
                id="supabase-url"
                type="url"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => onUrlChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-key">Supabase Publishable Key</Label>
              <Input
                id="supabase-key"
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => onKeyChange(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
