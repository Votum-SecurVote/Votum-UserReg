"use client"

import React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  User, Mail, Phone, CreditCard, Calendar, MapPin, Shield, Edit2,
  Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, X,
} from "lucide-react"

function maskAadhaar(aadhaar: string) {
  if (!aadhaar || aadhaar.length < 4) return "XXXX-XXXX-XXXX"
  const last4 = aadhaar.slice(-4)
  return `XXXX-XXXX-${last4}`
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

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  })
  const [saving, setSaving] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  if (!user) return null

  const profileFields: ProfileField[] = [
    { icon: <User className="h-4 w-4" />, label: "Full Name", value: user.fullName },
    { icon: <Mail className="h-4 w-4" />, label: "Email", value: user.email },
    { icon: <Phone className="h-4 w-4" />, label: "Phone", value: user.phone },
    { icon: <CreditCard className="h-4 w-4" />, label: "Aadhaar Number", value: maskAadhaar(user.aadhaar) },
    { icon: <Calendar className="h-4 w-4" />, label: "Date of Birth", value: formatDob(user.dob) },
    { icon: <User className="h-4 w-4" />, label: "Gender", value: user.gender },
    { icon: <MapPin className="h-4 w-4" />, label: "Address", value: user.address },
    { icon: <Shield className="h-4 w-4" />, label: "Role", value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
  ]

  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    updateProfile({
      fullName: editForm.fullName,
      phone: editForm.phone,
      address: editForm.address,
    })
    setSaving(false)
    setIsEditing(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    if (!passwordForm.current) {
      setPasswordError("Current password is required.")
      return
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordError("New passwords do not match.")
      return
    }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    setPasswordSuccess(true)
    setPasswordForm({ current: "", newPassword: "", confirm: "" })
    setTimeout(() => {
      setChangingPassword(false)
      setPasswordSuccess(false)
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and manage your account information
          </p>
        </div>
        <StatusBadge status={user.status} />
      </div>

      {/* Profile Card */}
      <Card className="shadow-lg mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Personal Information</CardTitle>
            <CardDescription>Your verified identity details</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-9">
              <Edit2 className="h-3.5 w-3.5 mr-1.5" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 10)
                    setEditForm((p) => ({ ...p, phone: v }))
                  }}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editForm.address}
                  onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSaveProfile} disabled={saving} className="h-10">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="h-10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="shadow-lg mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Password & Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </div>
          {!changingPassword && (
            <Button variant="outline" size="sm" onClick={() => setChangingPassword(true)} className="h-9">
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              Change Password
            </Button>
          )}
        </CardHeader>
        {changingPassword && (
          <CardContent>
            {passwordSuccess ? (
              <div className="flex items-center gap-2 p-3 rounded-md bg-accent/10 text-accent text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Password changed successfully.
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm" role="alert">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {passwordError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="current-pw">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-pw"
                      type={showCurrent ? "text" : "password"}
                      value={passwordForm.current}
                      onChange={(e) =>
                        setPasswordForm((p) => ({ ...p, current: e.target.value }))
                      }
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showCurrent ? "Hide password" : "Show password"}
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-pw">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-pw"
                      type={showNew ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                      }
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-pw">Confirm New Password</Label>
                  <Input
                    id="confirm-pw"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, confirm: e.target.value }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="h-10">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setChangingPassword(false)
                      setPasswordError("")
                    }}
                    className="h-10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        )}
      </Card>

      {/* Registration Status */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-base">Registration Status</CardTitle>
          <CardDescription>Track your account verification progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                user.status === "APPROVED"
                  ? "bg-accent/10"
                  : user.status === "PENDING"
                    ? "bg-[hsl(38,92%,50%)]/10"
                    : "bg-destructive/10"
              }`}
            >
              {user.status === "APPROVED" ? (
                <CheckCircle2 className="h-6 w-6 text-accent" />
              ) : user.status === "PENDING" ? (
                <Loader2 className="h-6 w-6 text-[hsl(38,92%,50%)] animate-spin" />
              ) : (
                <X className="h-6 w-6 text-destructive" />
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {user.status === "APPROVED" && "Account Verified & Approved"}
                {user.status === "PENDING" && "Verification In Progress"}
                {user.status === "REJECTED" && "Verification Rejected"}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.status === "APPROVED" &&
                  "Your identity has been verified. You are eligible to participate in active elections."}
                {user.status === "PENDING" &&
                  "Your documents are being reviewed. This process typically takes 1-3 business days."}
                {user.status === "REJECTED" &&
                  "Your verification was not successful. Please contact support for assistance."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
