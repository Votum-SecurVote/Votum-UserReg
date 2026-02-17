"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
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
  Loader2, CheckCircle2, AlertCircle, X, Lock, FileText, Fingerprint
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

/* --- Institutional Password Security Monitor --- */
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
  const colors = ["bg-red-600", "bg-red-600", "bg-amber-500", "bg-emerald-600", "bg-emerald-600"]
  const color = strength === 0 ? "bg-slate-200" : colors[strength - 1]

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-none transition-colors ${i <= strength ? color : "bg-slate-100"}`} />
        ))}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registry Security Score: {strength}/5</p>
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
    fullName: "", dob: "", gender: "", address: "", email: "", phone: "",
    aadhaar: "", aadhaarFile: null, profilePhoto: null, capturedPhoto: null,
    password: "", confirmPassword: "", acceptTerms: false,
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

  /* Cleanup Camera Session */
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })
      streamRef.current = stream
      setCameraActive(true)
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      setErrors((prev) => ({ ...prev, camera: "HARDWARE ERROR: Camera access denied by system." }))
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return
    const canvas = document.createElement("canvas")
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 640, 480)
      updateField("capturedPhoto", canvas.toDataURL("image/jpeg", 0.9))
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setCameraActive(false)
  }, [])

  const handleNext = () => {
    if (step === 1) {
      const errs: FormErrors = {}
      if (!form.fullName.trim()) errs.fullName = "Legal identity required."
      if (!form.aadhaar || form.aadhaar.length < 12) errs.aadhaar = "Valid 12-digit UID required."
      if (Object.keys(errs).length > 0) return setErrors(errs)
      setStep(2)
    } else if (step === 2) {
      if (!form.aadhaarFile && !form.capturedPhoto) {
        return setErrors({ uploads: "Mandatory verification documents missing." })
      }
      setStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return setErrors({ confirmPassword: "Security passphrase mismatch." })
    }
    const success = await register(form as any)
    if (success) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] px-4">
        <Card className="max-w-md w-full rounded-none border-t-8 border-t-[#1e40af] shadow-2xl bg-white">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-none bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Application Filed</h2>
            <p className="text-[#64748b] text-[11px] font-bold leading-relaxed uppercase tracking-wide px-4">
              Your enrollment dossier is now in the queue for manual audit.
              Verification typically completes within 48 business hours.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={onNavigateToLogin} className="w-full h-12 rounded-none bg-[#1e293b] font-black uppercase tracking-widest text-[11px]">
                Return to Login Terminal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">

      <div className="flex-1 overflow-y-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Registry Stepper */}
          <div className="mb-10">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex items-center gap-3 ${step >= s ? "text-[#1e40af]" : "text-slate-400"}`}>
                  <div className={`h-8 w-8 flex items-center justify-center border-2 font-black text-xs ${step >= s ? "border-[#1e40af] bg-white" : "border-slate-200"}`}>
                    {s}
                  </div>
                  <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">
                    {s === 1 ? "Vital Data" : s === 2 ? "Identity Audit" : "Security"}
                  </span>
                </div>
              ))}
            </div>
            <Progress value={(step / 3) * 100} className="h-1.5 rounded-none bg-slate-200" />
          </div>

          <Card className="rounded-none border-x-border border-b-border border-t-0 shadow-2xl bg-white">
            <div className="bg-[#1e40af] h-2 w-full" />
            <CardHeader className="pt-8 px-10">
              <CardTitle className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">
                {step === 1 ? "Registry Enrollment" : step === 2 ? "Credential Verification" : "Secure Access"}
              </CardTitle>
              <CardDescription className="text-[#64748b] font-bold text-[10px] uppercase tracking-widest mt-1">
                Provide mandatory legal identifiers for digital ballot authorization.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-10 pb-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Full Name</Label>
                      <Input className="rounded-none border-2 border-slate-200 h-12 uppercase" placeholder="AS PER AADHAAR" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
                      {errors.fullName && <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{errors.fullName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Date of Birth</Label>
                        <Input type="date" className="rounded-none border-2 border-slate-200 h-12" value={form.dob} onChange={(e) => updateField("dob", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gender</Label>
                        <Select value={form.gender} onValueChange={(v) => updateField("gender", v)}>
                          <SelectTrigger className="rounded-none border-2 border-slate-200 h-12"><SelectValue placeholder="SELECT" /></SelectTrigger>
                          <SelectContent className="rounded-none">
                            <SelectItem value="Male">MALE</SelectItem>
                            <SelectItem value="Female">FEMALE</SelectItem>
                            <SelectItem value="Other">OTHER</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registered Domicile Address</Label>
                      <Textarea className="rounded-none border-2 border-slate-200 min-h-[100px]" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aadhaar Identification (UID)</Label>
                      <Input className="rounded-none border-2 border-slate-200 h-12 font-mono tracking-widest" placeholder="XXXX-XXXX-XXXX" value={formatAadhaar(form.aadhaar)} onChange={(e) => updateField("aadhaar", e.target.value.replace(/\D/g, "").slice(0, 12))} />
                      {errors.aadhaar && <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{errors.aadhaar}</p>}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Identity Proof (Aadhaar PDF)</Label>
                      <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 p-10 bg-slate-50 cursor-pointer hover:bg-slate-100">
                        <Upload className="h-8 w-8 text-slate-400" />
                        <span className="text-[10px] font-black uppercase text-[#1e40af]">{form.aadhaarFile ? form.aadhaarFile.name : "Attach Encrypted PDF"}</span>
                        <input type="file" accept=".pdf" className="hidden" onChange={(e) => updateField("aadhaarFile", e.target.files?.[0] || null)} />
                      </label>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Biometric Portrait Enrollment</Label>
                      <div className="border-2 border-slate-200 bg-slate-50 overflow-hidden">
                        {cameraActive ? (
                          <div className="flex flex-col">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover grayscale brightness-110" />
                            <Button type="button" onClick={capturePhoto} className="rounded-none h-14 bg-[#1e40af] text-white font-black uppercase tracking-widest">Finalize Scan</Button>
                          </div>
                        ) : form.capturedPhoto ? (
                          <div className="relative aspect-video">
                            <img src={form.capturedPhoto} className="w-full h-full object-cover grayscale" />
                            <button type="button" onClick={() => updateField("capturedPhoto", null)} className="absolute top-4 right-4 bg-black text-white p-2"><X size={16} /></button>
                          </div>
                        ) : (
                          <button type="button" onClick={startCamera} className="w-full py-16 flex flex-col items-center gap-4 hover:bg-slate-100">
                            <Camera className="text-slate-400 h-10 w-10" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Activate Secure Biometric Scan</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Passphrase</Label>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} className="rounded-none border-2 border-slate-200 h-12 pr-12" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                      <PasswordStrengthBar password={form.password} />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Confirm Passphrase</Label>
                      <Input type={showConfirm ? "text" : "password"} className="rounded-none border-2 border-slate-200 h-12" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} />
                    </div>

                    <div className="pt-6 flex items-start gap-4 p-4 bg-slate-50 border border-slate-200">
                      <Checkbox checked={form.acceptTerms} onCheckedChange={(v) => updateField("acceptTerms", v === true)} className="mt-1 rounded-none border-2 border-[#1e40af]" />
                      <label className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        I hereby affirm that the information provided is accurate and I acknowledge that
                        <span className="text-[#1e40af] font-black underline ml-1">Identity Fraud</span>
                        is a punishable offense under regional digital audit laws.
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t-2 border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => { step === 1 ? onNavigateToLogin() : setStep(step - 1) }}
                    className="h-12 px-6 rounded-none font-black uppercase tracking-widest text-[10px] text-slate-500"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {step === 1 ? "Bureau Home" : "Back"}
                  </Button>

                  {step < 3 ? (
                    <Button type="button" onClick={handleNext} className="h-12 px-10 rounded-none bg-[#1e40af] text-white font-black uppercase tracking-widest text-[10px] shadow-lg">
                      Proceed <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading || !form.acceptTerms} className="h-12 px-10 rounded-none bg-[#1e40af] text-white font-black uppercase tracking-widest text-[10px] shadow-lg">
                      {isLoading ? "Encrypting Dossier..." : "File Application"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}