"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { ShieldCheck, LayoutDashboard, User, LogOut, Menu, X, Lock, Server } from "lucide-react"
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
    { id: "dashboard", label: "Registry Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Voter Profile", icon: User },
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setFullName(data.fullName)
      } catch (err) {
        console.error("Navbar profile fetch error:", err)
      }
    }
    fetchProfile()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col shadow-lg">

      {/* 2. Main Institutional Navbar */}
      <div className="bg-white border-b-2 border-[#1e40af] h-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-full">

          {/* Branding */}
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex flex-col items-start group transition-all"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#1e40af]" />
              <span className="text-xl font-black uppercase tracking-tighter text-[#0f172a]">VOTUM</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#64748b] ml-7">user</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center h-full gap-8">
            <div className="flex items-center h-full gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center gap-2 px-4 h-20 text-[11px] font-black uppercase tracking-widest transition-all ${currentPage === item.id
                    ? "text-[#1e40af]"
                    : "text-[#64748b] hover:text-[#1e40af] hover:bg-[#f8fafc]"
                    }`}
                >
                  <item.icon className={`h-4 w-4 ${currentPage === item.id ? "text-[#1e40af]" : "text-[#94a3b8]"}`} />
                  {item.label}
                  {/* Institutional Indicator */}
                  {currentPage === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#1e40af]" />
                  )}
                </button>
              ))}
            </div>

            <div className="h-10 w-px bg-[#e2e8f0]" />

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Authorized User</span>
                <span className="text-sm font-bold text-[#1e293b]">
                  {fullName || "Verification Required"}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="rounded-none border-2 border-[#1e293b] text-[#1e293b] font-black uppercase tracking-widest text-[10px] hover:bg-[#1e293b] hover:text-white px-4 h-10 transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Secure Logout
              </Button>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="md:hidden p-3 bg-[#f8fafc] border border-[#e2e8f0] text-[#1e40af]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-b border-[#e2e8f0] animate-in slide-in-from-top duration-200">
          <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">Registry Profile</span>
              <span className="text-sm font-bold text-[#1e293b]">{fullName}</span>
            </div>
            <Server className="h-4 w-4 text-[#cbd5e1]" />
          </div>

          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id)
                  setMobileOpen(false)
                }}
                className={`flex items-center gap-4 w-full px-4 py-4 text-xs font-black uppercase tracking-widest transition-colors ${currentPage === item.id
                  ? "bg-[#eff6ff] text-[#1e40af] border-l-4 border-[#1e40af]"
                  : "text-[#64748b] hover:bg-[#f8fafc]"
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
              className="flex items-center gap-4 w-full px-4 py-4 text-xs font-black uppercase tracking-widest text-[#991b1b] hover:bg-red-50 mt-4 border-t border-red-100"
            >
              <LogOut className="h-5 w-5" />
              Secure Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}