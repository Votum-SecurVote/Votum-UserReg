/**
 * Login Page.
 * Handles user authentication via email and password.
 */
"use client"

import React, { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, AlertCircle, Lock } from "lucide-react"

interface LoginPageProps {
  onNavigateToRegister: () => void
  onLoginSuccess: () => void
}

/**
 * Login Component.
 * Manages the login form state and submits credentials to the backend.
 */
export function LoginPage({
  onNavigateToRegister,
  onLoginSuccess,
}: LoginPageProps) {
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Handles credential submission and navigates to dashboard on success.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Bureau identification and passphrase are required.")
      return
    }
    try {
      const success = await login({ email, password })
      if (success) {
        onLoginSuccess()
      } else {
        setError("Authentication failed. Invalid credentials provided.")
      }
    } catch {
      setError("Connection to secure server failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] font-sans">

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Institutional Branding */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center justify-center w-20 h-20 rounded-none bg-[#1e40af] text-white mb-6 border-b-4 border-[#1e3a8a] shadow-md">
              <Lock className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black text-[#0f172a] tracking-tight uppercase">VOTUM</h1>
          </div>

          <Card className="rounded-none border-t-4 border-t-[#1e40af] border-x-border border-b-border shadow-2xl bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-extrabold text-[#1e293b] uppercase tracking-tight">
                Portal Sign In
              </CardTitle>
              <CardDescription className="text-[#64748b] font-medium mt-1">
                Authorize your session with Bureau credentials
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-[#fef2f2] border-l-4 border-l-[#dc2626] text-[#991b1b] text-xs font-bold uppercase tracking-wide">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Email</Label>
                  <Input
                    id="email"
                    className="rounded-none border-[#e2e8f0]"
                    placeholder="user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="rounded-none border-[#e2e8f0]"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#1e40af]"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 rounded-none bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-black uppercase tracking-widest shadow-lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    "Authorize Access"
                  )}
                </Button>

                <div className="mt-8 pt-6 border-t border-[#f1f5f9] text-center">
                  <p className="text-[#64748] text-[13px] mt-2 leading-relaxed">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={onNavigateToRegister}
                      className="text-[#1e40af] font-black underline underline-offset-4"
                    >
                      Register New Voter Profile
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}