"use client"

import React, { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

interface LoginPageProps {
  onNavigateToRegister: () => void
  onLoginSuccess: () => void
}

export function LoginPage({
  onNavigateToRegister,
  onLoginSuccess,
}: LoginPageProps) {
  const { verifyOtp, isLoading: isOtpLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"credentials" | "otp">("credentials")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const isLoading = isOtpLoading || isLoggingIn

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\d{10}$/.test(val)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email or phone is required.")
      return
    }

    if (!password) {
      setError("Password is required.")
      return
    }

    setIsLoggingIn(true)

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!res.ok) {
        throw new Error("Login failed")
      }

      const token = await res.text()

      localStorage.setItem("token", token)

      setStep("otp")

    } catch {
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleOtpVerify = async () => {
    setError("")

    if (otp.length !== 6) {
      setError("Please enter the full 6-digit OTP.")
      return
    }

    try {
      const success = await verifyOtp(otp)

      if (success) {
        onLoginSuccess() // ✅ Go to dashboard
      } else {
        setError("Invalid OTP. Please try again.")
      }
    } catch {
      setError("Verification failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SecureVote</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Government Electronic Voting Portal
          </p>
        </div>

        <Card className="shadow-xl border-border">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {step === "credentials" ? "Sign In" : "Two-Factor Authentication"}
            </CardTitle>
            <CardDescription>
              {step === "credentials"
                ? "Enter your credentials to access the portal"
                : "Enter the 6-digit code sent to your registered device"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="flex items-start gap-2 p-3 mb-4 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {step === "credentials" ? (
              <form onSubmit={handleLogin} className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="login-email">Email or Phone</Label>
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="name@example.com or 9876543210"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <p className="text-center text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={onNavigateToRegister}
                    className="text-primary font-semibold"
                  >
                    Register
                  </button>
                </p>
              </form>
            ) : (
              <div className="space-y-6">

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <span className="mx-2">-</span>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleOtpVerify}
                  className="w-full"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
