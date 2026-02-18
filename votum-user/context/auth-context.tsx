"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import type { User } from "@/lib/types"
import { mockUser } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  registeredUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  verifyOtp: (otp: string) => Promise<boolean>
  register: (data: Record<string, unknown>) => Promise<boolean>
  login: (data: Record<string, unknown>) => Promise<boolean>
  logout: () => void
  updateProfile?: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutes
const WARNING_BEFORE = 60 * 1000 // 1 minute before timeout

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [registeredUser, setRegisteredUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const logout = useCallback(() => {
    setUser(null)
    setShowTimeoutWarning(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    localStorage.removeItem("token")
  }, [])

  const resetInactivityTimer = useCallback(() => {
    if (!user) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    setShowTimeoutWarning(false)

    warningRef.current = setTimeout(() => {
      setShowTimeoutWarning(true)
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE)

    timeoutRef.current = setTimeout(() => {
      logout()
    }, INACTIVITY_TIMEOUT)
  }, [user, logout])

  useEffect(() => {
    if (!user) return

    const events = ["mousedown", "keydown", "touchstart", "scroll"]
    const handler = () => resetInactivityTimer()
    for (const e of events) window.addEventListener(e, handler)
    resetInactivityTimer()

    return () => {
      for (const e of events) window.removeEventListener(e, handler)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
    }
  }, [user, resetInactivityTimer])

  const login = useCallback(async (data: Record<string, unknown>) => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Login failed")

      const token = await res.text()
      localStorage.setItem("token", token)

      // In a real app, we might also fetch user details here
      // For now, setting a mock user to simulate "logged in" state
      setUser(mockUser)

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoading(false)
      return false
    }
  }, [])




  const verifyOtp = useCallback(async (_otp: string) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setUser(mockUser)
    setIsLoading(false)
    return true
  }, [])

  const register = useCallback(async (data: Record<string, unknown>) => {
    try {
      setIsLoading(true)

      const formData = new FormData()

      const requestPayload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        aadhaar: data.aadhaar,
        dob: data.dob,
        gender: data.gender,
        address: data.address,
      }

      formData.append(
        "data",
        new Blob([JSON.stringify(requestPayload)], {
          type: "application/json",
        })
      )

      if (data.profilePhoto) {
        formData.append("photo", data.profilePhoto as File)
      }

      if (data.aadhaarFile) {
        formData.append("aadhaarPdf", data.aadhaarFile as File)
      }

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      setIsLoading(false)
      return false
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        registeredUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        verifyOtp,
        register,
        logout,
        updateProfile: undefined,
      }}
    >
      {children}
      {showTimeoutWarning && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-xl max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Session Timeout Warning</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Your session will expire in 1 minute due to inactivity. Move your mouse or press any key to stay logged in.
            </p>
            <button
              type="button"
              onClick={() => resetInactivityTimer()}
              className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
