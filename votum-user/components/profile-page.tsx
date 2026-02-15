"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  User, Mail, Phone, Calendar, MapPin, Shield,
  Loader2
} from "lucide-react"

function formatDob(dob: string) {
  if (!dob) return "N/A"
  return new Date(dob).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

interface ProfileField {
  icon: React.ReactNode
  label: string
  value: string
}

export function ProfilePage() {

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // ✅ Fetch profile from backend
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
        setUser(data)

      } catch (err) {
        console.error("Profile fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const profileFields: ProfileField[] = [
    { icon: <User className="h-4 w-4" />, label: "Full Name", value: user.fullName },
    { icon: <Mail className="h-4 w-4" />, label: "Email", value: user.email },
    { icon: <Phone className="h-4 w-4" />, label: "Phone", value: user.phone },
    { icon: <Calendar className="h-4 w-4" />, label: "Date of Birth", value: formatDob(user.dob) },
    { icon: <User className="h-4 w-4" />, label: "Gender", value: user.gender },
    { icon: <MapPin className="h-4 w-4" />, label: "Address", value: user.address },
    { icon: <Shield className="h-4 w-4" />, label: "Status", value: user.status },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your verified identity details</CardDescription>
        </CardHeader>

        <CardContent>
          {profileFields.map((field, i) => (
            <div key={field.label}>
              <div className="flex items-start gap-3 py-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {field.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {field.label}
                  </p>
                  <p className="text-sm font-medium">
                    {field.value || "N/A"}
                  </p>
                </div>
              </div>
              {i < profileFields.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
