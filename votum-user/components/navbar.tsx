"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Shield, LayoutDashboard, User, LogOut, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [fullName, setFullName] = useState<string>("")

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
  ]

  // ✅ Fetch user name from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch("http://localhost:8080/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await res.json()
        setFullName(data.fullName)

      } catch (err) {
        console.error("Navbar profile fetch error:", err)
      }
    }

    fetchProfile()
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <Shield className="h-7 w-7" />
          <span className="text-lg font-bold tracking-tight">SecureVote</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === item.id
                  ? "bg-primary-foreground/20"
                  : "hover:bg-primary-foreground/10"
                }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}

          <div className="ml-3 pl-3 border-l border-primary-foreground/25 flex items-center gap-3">
            <span className="text-sm opacity-90">
              {fullName || "Loading..."}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-primary-foreground/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-primary-foreground/20 px-4 py-3 space-y-1">
          <div className="px-3 py-2 text-sm font-medium opacity-90">
            {fullName}
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id)
                setMobileOpen(false)
              }}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm font-medium transition-colors min-h-[48px] ${currentPage === item.id
                  ? "bg-primary-foreground/20"
                  : "hover:bg-primary-foreground/10"
                }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              logout()
              setMobileOpen(false)
            }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm font-medium hover:bg-primary-foreground/10 min-h-[48px]"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>
      )}
    </header>
  )
}
