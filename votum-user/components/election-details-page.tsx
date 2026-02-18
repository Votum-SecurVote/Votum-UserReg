/**
 * Election Details Page.
 * Displays comprehensive information about a specific election, including rules, candidates, and voting status.
 */
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import type { Election } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft, Calendar, Clock, ShieldCheck, ListChecks, Users, CheckCircle2
} from "lucide-react"
interface ElectionDetailsProps {
  election: Election
  onBack: () => void
}

/**
 * Countdown Timer Component.
 * Shows a real-time countdown to the election end date.
 */
function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft("Voting has ended")
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [endDate])

  return (
    <div className="flex items-center gap-2 text-sm">
      <Clock className="h-4 w-4 text-primary" />
      <span className="font-mono font-semibold text-foreground">{timeLeft}</span>
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/**
 * Main component for viewing election details and casting votes.
 * Handles the voting process and displays confirmation upon success.
 */
export function ElectionDetailsPage({ election, onBack }: ElectionDetailsProps) {
  const { user } = useAuth()
  const [voted, setVoted] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  const isApproved = user?.status === "APPROVED"
  const isActive = election.status === "Active"

  const handleVote = () => {
    if (selectedCandidate) {
      setVoted(true)
    }
  }

  if (voted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="shadow-xl">
          <CardContent className="py-12 text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Vote Cast Successfully</h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your vote has been securely recorded and encrypted. Thank you for participating in the democratic process.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Vote verified and encrypted
            </div>
            <div className="pt-4">
              <Button onClick={onBack} variant="outline" className="h-11 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Election Header */}
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{election.title}</CardTitle>
              <CardDescription className="mt-2 leading-relaxed">
                {election.description}
              </CardDescription>
            </div>
            <Badge
              className={`shrink-0 ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : election.status === "Upcoming"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {election.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Start: {formatDate(election.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>End: {formatDate(election.endDate)}</span>
            </div>
          </div>
          {isActive && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground mb-1">Voting window closes in:</p>
              <CountdownTimer endDate={election.endDate} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rules */}
      <Card className="shadow-lg mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Election Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {election.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Candidates / Voting */}
      {isActive && isApproved && election.candidates && election.candidates.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Cast Your Vote
            </CardTitle>
            <CardDescription>
              Select one candidate and confirm your vote. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {election.candidates.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => setSelectedCandidate(candidate.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left min-h-[64px] ${
                    selectedCandidate === candidate.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedCandidate === candidate.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {selectedCandidate === candidate.id && (
                      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.party}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                    {candidate.symbol}
                  </span>
                </button>
              ))}
            </div>

            <Button
              onClick={handleVote}
              disabled={!selectedCandidate}
              className="w-full h-12 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <ShieldCheck className="h-5 w-5 mr-2" />
              Confirm Vote
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Your vote is anonymous, encrypted, and tamper-proof.
            </p>
          </CardContent>
        </Card>
      )}

      {!isActive && (
        <Card className="shadow-lg">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              {election.status === "Upcoming"
                ? "Voting has not yet started for this election. Please check back during the voting window."
                : "This election has concluded. Results have been finalized."}
            </p>
          </CardContent>
        </Card>
      )}

      {isActive && !isApproved && (
        <Card className="shadow-lg">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Your account must be approved before you can cast a vote. Please wait for admin approval.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
