"use client"

import React from "react"
import { useAuth } from "@/context/auth-context"
import { mockElections } from "@/lib/mock-data"
import type { Election } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShieldAlert,
  Calendar,
  Clock,
  ChevronRight,
  Vote,
  ShieldCheck,
  FileText,
  User
} from "lucide-react"

interface DashboardPageProps {
  onViewElection: (election: Election) => void
}

/* --- Institutional Status Stamp --- */
function StatusStamp({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "border-emerald-700 text-emerald-700 bg-emerald-50",
    PENDING: "border-amber-600 text-amber-600 bg-amber-50",
    REJECTED: "border-red-700 text-red-700 bg-red-50",
  }
  return (
    <span className={`inline-flex items-center uppercase tracking-widest text-[10px] font-black border-2 px-3 py-1 ${styles[status] || "border-slate-400 text-slate-400"}`}>
      {status}
    </span>
  )
}

/* --- Formal Election Badge --- */
function ElectionStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-[#1e40af] text-white",
    Upcoming: "bg-slate-200 text-slate-700",
    Closed: "bg-slate-800 text-white",
  }
  return (
    <Badge className={`rounded-none uppercase text-[10px] font-black tracking-tighter ${styles[status] || "bg-muted"} hover:opacity-100`}>
      {status}
    </Badge>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function DashboardPage({ onViewElection }: DashboardPageProps) {
  const { user } = useAuth()

  if (!user) return null

  const isApproved = user.status === "APPROVED"

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] font-sans">

      {/* 2. Scrollable Dashboard Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b-4 border-[#1e40af] pb-8">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-white border-2 border-[#cbd5e1] flex items-center justify-center">
                <User className="h-10 w-10 text-[#64748b]" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#0f172a] uppercase tracking-tight">
                  {user.fullName}
                </h1>
                <p className="text-[#64748b] text-xs font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                  <FileText className="h-3 w-3" /> Registered Citizen Profile
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400">Account Authorization</span>
              <StatusStamp status={user.status} />
            </div>
          </div>

          {/* Account Pending Alert - Redesigned as a Formal Notice */}
          {!isApproved && (
            <div className="flex items-start gap-4 p-6 mb-10 bg-amber-50 border-2 border-amber-200">
              <ShieldAlert className="h-6 w-6 text-amber-600 mt-1 shrink-0" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-amber-900">Official Notice: Verification Required</h3>
                <p className="text-sm text-amber-800/80 mt-1 font-medium leading-relaxed">
                  Your identity credentials are currently under review by the Bureau.
                  In accordance with national security protocols, your voting privileges
                  will remain restricted until identity verification is finalized.
                </p>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Active Polls", count: "Active", icon: <Vote className="text-[#1e40af]" />, bg: "bg-white" },
              { label: "Upcoming Records", count: "Upcoming", icon: <Calendar className="text-slate-600" />, bg: "bg-white" },
              { label: "Archived Results", count: "Closed", icon: <Clock className="text-slate-400" />, bg: "bg-slate-50" },
            ].map((stat, i) => (
              <Card key={i} className={`rounded-none border-2 border-slate-200 shadow-none ${stat.bg}`}>
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="h-12 w-12 border border-slate-100 flex items-center justify-center shrink-0 bg-slate-50">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#0f172a]">
                      {mockElections.filter((e) => e.status === stat.count).length}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Election Registry List */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Election Registry</h2>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <div className="space-y-6">
              {mockElections.map((election) => (
                <Card key={election.id} className="rounded-none border-2 border-slate-200 shadow-none hover:border-[#1e40af] transition-colors bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-black uppercase tracking-tight text-[#0f172a]">
                          {election.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-slate-600 font-medium leading-relaxed">
                          {election.description}
                        </CardDescription>
                      </div>
                      <ElectionStatusBadge status={election.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#1e40af]" />
                          Starts: {formatDate(election.startDate)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#1e40af]" />
                          Ends: {formatDate(election.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {election.status === "Active" && isApproved && (
                          <Button
                            className="rounded-none bg-[#1e40af] text-white hover:bg-[#1e3a8a] px-8 h-10 font-black uppercase tracking-widest shadow-md"
                            onClick={() => onViewElection(election)}
                          >
                            <Vote className="h-4 w-4 mr-2" />
                            Cast Digital Ballot
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="rounded-none border-2 border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[10px] px-6 h-10 hover:bg-slate-50"
                          onClick={() => onViewElection(election)}
                        >
                          Review Specification
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-200 py-6 px-10 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Secure Digital Voting Infrastructure © 2026
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-[#1e40af]">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Contact Bureau</a>
          </div>
        </div>
      </footer>
    </div>
  )
}