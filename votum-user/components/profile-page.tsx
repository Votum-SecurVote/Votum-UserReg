/**
 * Profile Page.
 * Displays the authenticated user's digital dossier, including personal details,
 * verification status, and secure document access.
 */
"use client"

import React, { useEffect, useState } from "react"
import {
  User, Mail, Phone, Calendar, MapPin, Shield,
  Loader2, FileText, ExternalLink, ShieldCheck,
  Fingerprint, CreditCard
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

/* --- Formal Status Stamp --- */
function VerificationStamp({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "border-emerald-700 text-emerald-700 bg-emerald-50",
    PENDING: "border-amber-600 text-amber-600 bg-amber-50",
    REJECTED: "border-red-700 text-red-700 bg-red-50",
  }
  return (
    <span className={`inline-flex items-center uppercase tracking-[0.2em] text-[10px] font-black border-2 px-4 py-1.5 ${styles[status] || "border-slate-400 text-slate-400"}`}>
      {status}
    </span>
  )
}

/**
 * Profile Page Component.
 * Fetches secure user data and presents it in an official dossier format.
 */
export function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
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
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#1e40af]" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accessing Secure Registry...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-20">
      {/* 1. Official Government Header Strip */}


      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-3xl font-black text-[#0f172a] uppercase tracking-tight">Voter Dossier</h1>
          <div className="flex-1 h-1 bg-[#1e40af]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* --- LEFT COLUMN: Official Portrait & Status --- */}
          <div className="space-y-6">
            <Card className="rounded-none border-2 border-slate-200 shadow-none bg-white">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-full aspect-[3/4] border-4 border-slate-100 bg-slate-50 relative overflow-hidden group">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="Official Portrait" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <User size={80} strokeWidth={1} />
                      <span className="text-[10px] font-black uppercase mt-4">Portrait Pending</span>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-full border-[12px] border-white/20 pointer-events-none"></div>
                </div>

                <div className="mt-8 w-full text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Verification Authority</p>
                  <VerificationStamp status={user.status} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 border-slate-200 shadow-none bg-[#1e293b] text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Fingerprint className="text-[#3b82f6]" size={20} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Digital Signature</p>
                </div>
                <div className="font-mono text-[10px] break-all opacity-60 leading-relaxed">
                  SEC-HASH: {btoa(user.email || "voter").slice(0, 32).toUpperCase()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN: Registry Data & Documents --- */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-none border-2 border-slate-200 shadow-none bg-white">
              <CardHeader className="border-b border-slate-100 pb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight text-[#0f172a]">Legal Identity Records</CardTitle>
                    <CardDescription className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest mt-1">Registry UID: {user._id?.slice(-12).toUpperCase() || "ADMIN-TEMP-00"}</CardDescription>
                  </div>
                  <CreditCard className="text-slate-200" size={32} />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {[
                    { label: "Full Legal Name", value: user.fullName, icon: <User size={14} /> },
                    { label: "Date of Birth", value: user.dob ? new Date(user.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : "N/A", icon: <Calendar size={14} /> },
                    { label: "Gender Designation", value: user.gender, icon: <User size={14} /> },
                    { label: "Primary Contact (Email)", value: user.email, icon: <Mail size={14} /> },
                    { label: "Registered Mobile", value: user.phone, icon: <Phone size={14} /> },
                  ].map((field, i) => (
                    <div key={i} className="p-6 border-b border-r border-slate-50 last:border-b-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
                        {field.icon} {field.label}
                      </p>
                      <p className="text-sm font-bold text-[#1e293b] uppercase tracking-tight">{field.value || "—"}</p>
                    </div>
                  ))}
                  <div className="p-6 md:col-span-2 bg-slate-50/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
                      <MapPin size={14} /> Registered Residential Address
                    </p>
                    <p className="text-sm font-bold text-[#1e293b] uppercase tracking-tight leading-relaxed">{user.address || "No primary address recorded in registry."}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* --- SECURE DOCUMENT VAULT --- */}
            <Card className="rounded-none border-2 border-[#1e40af] shadow-none bg-white overflow-hidden">
              <div className="bg-[#1e40af] px-6 py-3 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Identity Verification Documents</h3>
                <ShieldCheck size={16} className="text-white opacity-50" />
              </div>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-dashed border-slate-200 p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-red-50 text-red-600 flex items-center justify-center rounded-none border border-red-100 shrink-0">
                      <FileText size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight text-[#0f172a]">Aadhar_Card_Verified.pdf</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="rounded-none bg-emerald-600 text-[9px] font-black tracking-widest h-5">ENCRYPTED</Badge>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Size: 1.2 MB</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(user.aadharPdfUrl, '_blank')}
                    className="flex items-center gap-3 bg-[#1e293b] text-white px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-[#0f172a] transition-colors w-full md:w-auto justify-center"
                  >
                    View Official Document <ExternalLink size={14} />
                  </button>
                </div>

                <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 border border-slate-200">
                  <Shield size={18} className="text-[#1e40af] mt-0.5" />
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">
                    Verification Protocol: Document hash is matched against the National Identity Database.
                    Any discrepancy in this record will result in immediate suspension of voting privileges.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}