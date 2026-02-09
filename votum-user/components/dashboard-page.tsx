"use client"

import { useAuth } from "@/context/auth-context"
import { mockElections } from "@/lib/mock-data"
import type { Election } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, Clock, ChevronRight, Vote } from "lucide-react"

interface DashboardPageProps {
  onViewElection: (election: Election) => void
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "bg-accent text-accent-foreground",
    PENDING: "bg-[hsl(38,92%,50%)] text-primary-foreground",
    REJECTED: "bg-destructive text-destructive-foreground",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  )
}

function ElectionStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-accent text-accent-foreground",
    Upcoming: "bg-primary text-primary-foreground",
    Closed: "bg-muted text-muted-foreground",
  }
  return (
    <Badge className={`${styles[status] || "bg-muted"} hover:opacity-90`}>
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user.fullName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your e-voting dashboard
          </p>
        </div>
        <StatusBadge status={user.status} />
      </div>

      {/* Account pending alert */}
      {!isApproved && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-[hsl(38,92%,50%)]/10 border border-[hsl(38,92%,50%)]/30">
          <AlertCircle className="h-5 w-5 text-[hsl(38,92%,50%)] mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Account Pending Approval</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your account is currently under review. You will be able to participate in elections once your identity is verified and account is approved.
            </p>
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Vote className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockElections.filter((e) => e.status === "Active").length}
              </p>
              <p className="text-xs text-muted-foreground">Active Elections</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockElections.filter((e) => e.status === "Upcoming").length}
              </p>
              <p className="text-xs text-muted-foreground">Upcoming Elections</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockElections.filter((e) => e.status === "Closed").length}
              </p>
              <p className="text-xs text-muted-foreground">Closed Elections</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elections list */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Elections</h2>
        <div className="space-y-4">
          {mockElections.map((election) => (
            <Card key={election.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{election.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {election.description}
                    </CardDescription>
                  </div>
                  <ElectionStatusBadge status={election.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(election.startDate)}
                    </span>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(election.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {election.status === "Active" && isApproved && (
                      <Button
                        size="sm"
                        className="bg-accent text-accent-foreground hover:bg-accent/90 h-9"
                        onClick={() => onViewElection(election)}
                      >
                        Proceed to Vote
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewElection(election)}
                      className="h-9"
                    >
                      View Details
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
