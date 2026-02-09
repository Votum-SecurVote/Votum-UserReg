"use client"

import React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Shield, ArrowLeft, ArrowRight, Upload, Camera, Eye, EyeOff,
  Loader2, CheckCircle2, AlertCircle, X,
} from "lucide-react"

interface RegistrationPageProps {
  onNavigateToLogin: () => void
  onNavigateToProfile?: () => void
}

interface FormData {
  fullName: string
  dob: string
  gender: string
  address: string
  email: string
  phone: string
  aadhaar: string
  aadhaarFile: File | null
  profilePhoto: File | null
  capturedPhoto: string | null
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

interface FormErrors {
  [key: string]: string
}

function PasswordStrengthBar({ password }: { password: string }) {
  const getStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[a-z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }
  const strength = getStrength(password)
  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"]
  const colors = [
    "bg-destructive",
    "bg-destructive",
    "bg-[hsl(38,92%,50%)]",
    "bg-accent",
    "bg-accent",
  ]
  const label = strength === 0 ? "" : labels[strength - 1]
  const color = strength === 0 ? "bg-muted" : colors[strength - 1]

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= strength ? color : "bg-muted"
            }`}
          />
        ))}
      </div>
      {label && (
        <p className={`text-xs ${strength <= 2 ? "text-destructive" : "text-accent"}`}>
          {label}
        </p>
      )}
    </div>
  )
}

export function RegistrationPage({ onNavigateToLogin, onNavigateToProfile }: RegistrationPageProps) {
  const { register, isLoading } = useAuth()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [form, setForm] = useState<FormData>({
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    email: "",
    phone: "",
    aadhaar: "",
    aadhaarFile: null,
    profilePhoto: null,
    capturedPhoto: null,
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const formatAadhaar = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 12)
    return digits.replace(/(\d{4})(?=\d)/g, "$1-")
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) track.stop()
      }
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch {
      setErrors((prev) => ({
        ...prev,
        camera: "Camera access denied. Please allow camera permissions.",
      }))
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return
    const canvas = document.createElement("canvas")
    canvas.width = 320
    canvas.height = 240
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 320, 240)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
      updateField("capturedPhoto", dataUrl)
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop()
    }
    setCameraActive(false)
  }, [])

  const validateStep1 = (): boolean => {
    const errs: FormErrors = {}
    if (!form.fullName.trim()) errs.fullName = "Full name is required."
    if (!form.dob) errs.dob = "Date of birth is required."
    if (!form.gender) errs.gender = "Gender is required."
    if (!form.address.trim()) errs.address = "Address is required."
    if (!form.email.trim()) errs.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address."
    if (!form.phone.trim()) errs.phone = "Phone number is required."
    else if (!/^\d{10}$/.test(form.phone))
      errs.phone = "Enter a valid 10-digit phone number."
    if (!form.aadhaar.trim()) errs.aadhaar = "Aadhaar number is required."
    else if (form.aadhaar.replace(/\D/g, "").length !== 12)
      errs.aadhaar = "Aadhaar must be exactly 12 digits."
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = (): boolean => {
    const errs: FormErrors = {}
    if (!form.aadhaarFile && !form.profilePhoto && !form.capturedPhoto) {
      errs.uploads = "Please upload at least your Aadhaar document."
    }
    if (!form.aadhaarFile) errs.aadhaarFile = "Aadhaar PDF is required."
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep3 = (): boolean => {
    const errs: FormErrors = {}
    if (!form.password) errs.password = "Password is required."
    else if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters."
    else if (!/[A-Z]/.test(form.password))
      errs.password = "Include at least one uppercase letter."
    else if (!/\d/.test(form.password))
      errs.password = "Include at least one number."
    else if (!/[^A-Za-z0-9]/.test(form.password))
      errs.password = "Include at least one special character."
    if (!form.confirmPassword) errs.confirmPassword = "Confirm your password."
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match."
    if (!form.acceptTerms) errs.acceptTerms = "You must accept the terms."
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const prevStep = () => {
    setErrors({})
    setStep((s) => Math.max(1, s - 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep3()) return
    const success = await register(form as unknown as Record<string, unknown>)
    if (success) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Registration Submitted</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your registration has been submitted successfully. Your account is now pending approval by an administrator. You will be notified once your account is approved.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Awaiting Approval
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {onNavigateToProfile && (
                <Button onClick={onNavigateToProfile} className="w-full h-11">
                  View My Profile
                </Button>
              )}
              <Button onClick={onNavigateToLogin} variant="outline" className="w-full h-11">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-3 shadow-lg">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Register for SecureVote e-voting portal
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span className={step >= 1 ? "text-primary font-semibold" : ""}>
              1. Personal Info
            </span>
            <span className={step >= 2 ? "text-primary font-semibold" : ""}>
              2. Identity Upload
            </span>
            <span className={step >= 3 ? "text-primary font-semibold" : ""}>
              3. Account Security
            </span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        <Card className="shadow-xl border-border">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Personal Information"}
              {step === 2 && "Identity Verification"}
              {step === 3 && "Account Security"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Provide your personal details as per government records."}
              {step === 2 && "Upload your identity documents and photo for verification."}
              {step === 3 && "Set up a secure password for your account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="As per government ID"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className="h-11"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={form.dob}
                        onChange={(e) => updateField("dob", e.target.value)}
                        className="h-11"
                      />
                      {errors.dob && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.dob}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={form.gender} onValueChange={(v) => updateField("gender", v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Full residential address"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="h-11"
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit number"
                        value={form.phone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 10)
                          updateField("phone", v)
                        }}
                        className="h-11"
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input
                      id="aadhaar"
                      placeholder="XXXX-XXXX-XXXX"
                      value={formatAadhaar(form.aadhaar)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 12)
                        updateField("aadhaar", raw)
                      }}
                      className="h-11 font-mono tracking-wider"
                    />
                    {errors.aadhaar && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.aadhaar}
                      </p>
                    )}
                    {form.aadhaar.length > 0 && form.aadhaar.length < 12 && !errors.aadhaar && (
                      <p className="text-xs text-muted-foreground">
                        {form.aadhaar.length}/12 digits
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Identity Upload */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Aadhaar Upload */}
                  <div className="space-y-2">
                    <Label>Aadhaar Document (PDF)</Label>
                    <label
                      htmlFor="aadhaar-upload"
                      className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {form.aadhaarFile ? form.aadhaarFile.name : "Click to upload Aadhaar PDF"}
                      </span>
                      <input
                        id="aadhaar-upload"
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          updateField("aadhaarFile", file)
                        }}
                      />
                    </label>
                    {errors.aadhaarFile && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.aadhaarFile}
                      </p>
                    )}
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {form.profilePhoto ? form.profilePhoto.name : "Click to upload a photo (JPG/PNG)"}
                      </span>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/jpeg,image/png"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          updateField("profilePhoto", file)
                        }}
                      />
                    </label>
                  </div>

                  {/* Camera Capture */}
                  <div className="space-y-2">
                    <Label>Live Face Capture</Label>
                    <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
                      {cameraActive ? (
                        <div className="relative">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full aspect-video bg-foreground/5 object-cover"
                          />
                          <div className="flex gap-2 p-3">
                            <Button type="button" onClick={capturePhoto} className="flex-1 h-11">
                              <Camera className="h-4 w-4 mr-2" />
                              Capture
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                if (streamRef.current)
                                  for (const track of streamRef.current.getTracks()) track.stop()
                                setCameraActive(false)
                              }}
                              className="h-11"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : form.capturedPhoto ? (
                        <div className="relative">
                          <img
                            src={form.capturedPhoto || "/placeholder.svg"}
                            alt="Captured face"
                            className="w-full aspect-video object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => updateField("capturedPhoto", null)}
                            className="absolute top-2 right-2 bg-foreground/70 text-primary-foreground rounded-full p-1 hover:bg-foreground/90 transition-colors"
                            aria-label="Remove captured photo"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex flex-col items-center justify-center gap-2 w-full p-8 hover:bg-secondary/60 transition-colors"
                        >
                          <Camera className="h-10 w-10 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Click to open camera for face registration
                          </span>
                        </button>
                      )}
                    </div>
                    {errors.camera && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.camera}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Account Security */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {form.password && <PasswordStrengthBar password={form.password} />}
                    {errors.password && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="reg-confirm"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={form.acceptTerms}
                      onCheckedChange={(v) => updateField("acceptTerms", v === true)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      I accept the{" "}
                      <span className="text-primary font-medium underline">Terms of Service</span>{" "}
                      and{" "}
                      <span className="text-primary font-medium underline">Privacy Policy</span>.
                      I understand that my data will be processed in accordance with government data protection regulations.
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.acceptTerms}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-4 border-t border-border">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep} className="h-11 bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onNavigateToLogin}
                    className="h-11 text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                )}

                {step < 3 ? (
                  <Button type="button" onClick={nextStep} className="h-11">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="h-11 min-w-[180px]" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
