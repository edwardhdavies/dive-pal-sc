"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageSquare, Map, Users, User, LogOut, Settings, Plus, BookOpen, Calculator } from "lucide-react"

interface NavigationProps {
  currentScreen: string
  onScreenChange: (screen: string) => void
  user?: { id: string; name: string; email: string } | null
  onAuthClick?: () => void
  onLogout?: () => void
  onOpenDiveLog?: () => void
}

export default function Navigation({
  currentScreen,
  onScreenChange,
  user,
  onAuthClick,
  onLogout,
  onOpenDiveLog,
}: NavigationProps) {
  const navItems = [
    { id: "chatbot", label: "Search", icon: MessageSquare },
    { id: "map", label: "Map", icon: Map },
    { id: "feed", label: "Feed", icon: Users },
    { id: "tools", label: "Tools", icon: Calculator }, // Added Tools tab
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-ocean-200 z-40 md:top-0 md:bottom-auto">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 bg-ocean-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-ocean-900">Dive Pal</span>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center justify-around w-full md:w-auto md:gap-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentScreen === item.id
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onScreenChange(item.id)}
                    className={`flex flex-col items-center gap-1 h-auto py-2 px-3 md:flex-row md:gap-2 md:py-2 md:px-4 ${
                      isActive ? "text-ocean-600 bg-ocean-50" : "text-ocean-400 hover:text-ocean-600 hover:bg-ocean-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">{item.label}</span>
                  </Button>
                )
              })}
            </div>

            {/* User Menu - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex items-center gap-3">
              {onOpenDiveLog && (
                <Button onClick={onOpenDiveLog} className="bg-ocean-500 hover:bg-ocean-600 text-white" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Log Dive
                </Button>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-ocean-50">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg" alt={user.name} />
                        <AvatarFallback className="bg-ocean-100 text-ocean-700 text-sm">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-ocean-900">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => onScreenChange("profile")} className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={onAuthClick} className="bg-ocean-500 hover:bg-ocean-600 text-white">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {onOpenDiveLog && (
        <Button
          onClick={onOpenDiveLog}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-ocean-500 hover:bg-ocean-600 text-white shadow-lg z-50 md:hidden"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}
    </>
  )
}
