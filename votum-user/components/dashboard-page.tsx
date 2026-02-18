"use client"

import React, { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import type { Election as GlobalElection } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { User, FileText } from "lucide-react"

interface Candidate {
  id: string
  name: string
  party?: string
  symbol?: string
}

interface Ballot {
  id: string
  title: string
  description?: string
  candidates: Candidate[]
}

interface Election {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: string
  ballots: Ballot[]
}

interface UserProfile {
  fullName: string
  status: string
}

function StatusStamp({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "border-emerald-700 text-emerald-700 bg-emerald-50",
    PENDING: "border-amber-600 text-amber-600 bg-amber-50",
    REJECTED: "border-red-700 text-red-700 bg-red-50",
  }

  return (
    <span
      className={`inline-flex items-center uppercase tracking-widest text-[10px] font-black border-2 px-3 py-1 ${styles[status] || "border-slate-400 text-slate-400"
        }`}
    >
      {status}
    </span>
  )
}

function ElectionStatusBadge({ status }: { status: string }) {
  return (
    <Badge className="rounded-none uppercase text-[10px] font-black tracking-tight bg-[#1e40af] text-white">
      {status}
    </Badge>
  )
}

interface DashboardPageProps {
  onViewElection: (election: GlobalElection) => void
}

export function DashboardPage({ onViewElection }: DashboardPageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        // Fetch profile
        const profileRes = await fetch(
          "http://localhost:8080/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const profileData = await profileRes.json()
        setProfile(profileData)

        // Fetch elections
        const electionRes = await fetch(
          "http://localhost:8080/api/user/elections",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const electionData = await electionRes.json()
        setElections(electionData)
      } catch (error) {
        console.error("Dashboard fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] font-sans">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* USER HEADER */}
          {profile && (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b-4 border-[#1e40af] pb-8">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-white border-2 border-[#cbd5e1] flex items-center justify-center">
                  <User className="h-10 w-10 text-[#64748b]" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-[#0f172a] uppercase tracking-tight">
                    {profile.fullName}
                  </h1>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2">
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Account Authorization
                </span>
                <StatusStamp status={profile.status} />
              </div>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <p className="text-center text-slate-500 font-bold">
              Loading elections...
            </p>
          )}

          {/* NO ELECTIONS */}
          {!loading && elections.length === 0 && (
            <p className="text-center text-slate-500 font-bold">
              No active elections available.
            </p>
          )}

          {/* ELECTIONS */}
          <div className="space-y-10">
            {elections.map((election) => (
              <Card
                key={election.id}
                className="rounded-none border-2 border-slate-200 shadow-none bg-white"
              >
                <CardHeader className="border-b border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-black uppercase text-[#0f172a]">
                        {election.title}
                      </CardTitle>

                      <CardDescription className="mt-2 text-slate-600">
                        {election.description}
                      </CardDescription>

                      <div className="mt-3 text-xs text-slate-500 font-semibold space-y-1">
                        <p>
                          Starts:{" "}
                          {new Date(election.startDate).toLocaleString()}
                        </p>
                        <p>
                          Ends: {new Date(election.endDate).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <ElectionStatusBadge status={election.status} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 pt-6">
                  {election.ballots?.map((ballot) => (
                    <div
                      key={ballot.id}
                      className="border-2 border-slate-100 p-6 bg-slate-50"
                    >
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#1e40af] mb-4">
                        {ballot.title}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ballot.candidates?.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="border border-slate-200 bg-white p-4"
                          >
                            <p className="font-black text-[#0f172a] uppercase tracking-tight">
                              {candidate.name}
                            </p>

                            {candidate.party && (
                              <p className="text-xs text-slate-500 mt-1">
                                Party: {candidate.party}
                              </p>
                            )}

                            {candidate.symbol && (
                              <p className="text-xs text-slate-500">
                                Symbol: {candidate.symbol}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 px-10 shrink-0">
        <div className="max-w-6xl mx-auto flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <p>VOTUM © 2026</p>
        </div>
      </footer>
    </div>
  )
}
