"use client"

import React from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  User, Mail, Phone, CreditCard, Calendar, MapPin, Shield,
  CheckCircle2, Loader2, X, ArrowLeft,
} from "lucide-react"

function maskAadhaar(aadhaar: string) {
  if (!aadhaar || aadhaar.length < 4) return "XXXX-XXXX-XXXX"
  const last4 = aadhaar.slice(-4)
  return `XXXX-XXXX-${last4}`
}

function formatAadhaar(aadhaar: string) {
  if (!aadhaar) return "XXXX-XXXX-XXXX"
  const digits = aadhaar.replace(/\D/g, "")
  if (digits.length === 12) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`
  }
  return maskAadhaar(aadhaar)
}

function formatDob(dob: string) {
  if (!dob) return "N/A"
  return new Date(dob).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "bg-accent text-accent-foreground",
    PENDING: "bg-[hsl(38,92%,50%)] text-primary-foreground",
    REJECTED: "bg-destructive text-destructive-foreground",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  )
}

interface ProfileField {
  icon: React.ReactNode
  label: string
  value: string
}

interface RegistrationProfileViewProps {
  onNavigateToLogin: () => void
}

export function RegistrationProfileView({ onNavigateToLogin }: RegistrationProfileViewProps) {
  const { registeredUser } = useAuth()

  if (!registeredUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <X className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground">No Registration Data</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              No registration data found. Please complete the registration process first.
            </p>
            <Button onClick={onNavigateToLogin} className="w-full h-11">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profileFields: ProfileField[] = [
    { icon: <User className="h-4 w-4" />, label: "Full Name", value: registeredUser.fullName },
    { icon: <Mail className="h-4 w-4" />, label: "Email", value: registeredUser.email },
    { icon: <Phone className="h-4 w-4" />, label: "Phone", value: registeredUser.phone },
    { icon: <CreditCard className="h-4 w-4" />, label: "Aadhaar Number", value: formatAadhaar(registeredUser.aadhaar) },
    { icon: <Calendar className="h-4 w-4" />, label: "Date of Birth", value: formatDob(registeredUser.dob) },
    { icon: <User className="h-4 w-4" />, label: "Gender", value: registeredUser.gender },
    { icon: <MapPin className="h-4 w-4" />, label: "Address", value: registeredUser.address },
    { icon: <Shield className="h-4 w-4" />, label: "Role", value: registeredUser.role.charAt(0).toUpperCase() + registeredUser.role.slice(1) },
  ]

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Registration Summary</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review your submitted information
            </p>
          </div>
          <StatusBadge status={registeredUser.status} />
        </div>

        {/* Profile Photo */}
        {registeredUser.profilePhoto && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-base">Profile Photo</CardTitle>
              <CardDescription>Photo captured during registration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <img
                  src={registeredUser.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-lg object-cover border"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Information */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
            <CardDescription>Your submitted identity details (read-only)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {profileFields.map((field, i) => (
                <div key={field.label}>
                  <div className="flex items-start gap-3 py-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      {field.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <p className="text-sm font-medium text-foreground break-words">
                        {field.value}
                      </p>
                    </div>
                  </div>
                  {i < profileFields.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Registration Status */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-base">Registration Status</CardTitle>
            <CardDescription>Track your account verification progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                  registeredUser.status === "APPROVED"
                    ? "bg-accent/10"
                    : registeredUser.status === "PENDING"
                      ? "bg-[hsl(38,92%,50%)]/10"
                      : "bg-destructive/10"
                }`}
              >
                {registeredUser.status === "APPROVED" ? (
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                ) : registeredUser.status === "PENDING" ? (
                  <Loader2 className="h-6 w-6 text-[hsl(38,92%,50%)] animate-spin" />
                ) : (
                  <X className="h-6 w-6 text-destructive" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {registeredUser.status === "APPROVED" && "Account Verified & Approved"}
                  {registeredUser.status === "PENDING" && "Verification In Progress"}
                  {registeredUser.status === "REJECTED" && "Verification Rejected"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {registeredUser.status === "APPROVED" &&
                    "Your identity has been verified. You are eligible to participate in active elections."}
                  {registeredUser.status === "PENDING" &&
                    "Your documents are being reviewed. This process typically takes 1-3 business days. You will receive an email notification once the review is complete."}
                  {registeredUser.status === "REJECTED" &&
                    "Your verification was not successful. Please contact support for assistance."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="shadow-lg border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 text-sm">Important Notice</h3>
                <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                  Your registration information cannot be edited after submission. If you notice any errors or need to update your information, please contact our support team. You will receive an email notification once your account verification is complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Button onClick={onNavigateToLogin} variant="outline" className="h-11 min-w-[200px]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  )
}
