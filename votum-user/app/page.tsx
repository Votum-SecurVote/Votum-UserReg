"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import type { Election } from "@/lib/types"
import { LoginPage } from "@/components/login-page"
import { RegistrationPage } from "@/components/registration-page"
import { RegistrationProfileView } from "@/components/registration-profile-view"
import { DashboardPage } from "@/components/dashboard-page"
import { ElectionDetailsPage } from "@/components/election-details-page"
import { ProfilePage } from "@/components/profile-page"
import { Navbar } from "@/components/navbar"

type AppPage = "login" | "register" | "registration-profile" | "dashboard" | "election" | "profile"

export default function Page() {
  const { isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState<AppPage>("login")
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)

  // Redirect to login if not authenticated and trying to access protected pages
  const protectedPages: AppPage[] = ["dashboard", "election", "profile"]
  const activePage =
    !isAuthenticated && protectedPages.includes(currentPage) ? "login" : currentPage

  const handleViewElection = (election: Election) => {
    setSelectedElection(election)
    setCurrentPage("election")
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page as AppPage)
  }

  // Auth pages (no navbar)
  if (activePage === "login") {
    return (
      <LoginPage
        onNavigateToRegister={() => setCurrentPage("register")}
      />
    )
  }

  if (activePage === "register") {
    return (
      <RegistrationPage
        onNavigateToLogin={() => setCurrentPage("login")}
        onNavigateToProfile={() => setCurrentPage("registration-profile")}
      />
    )
  }

  if (activePage === "registration-profile") {
    return (
      <RegistrationProfileView
        onNavigateToLogin={() => setCurrentPage("login")}
      />
    )
  }

  // Protected pages (with navbar)
  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={activePage} onNavigate={handleNavigate} />
      <main>
        {activePage === "dashboard" && (
          <DashboardPage onViewElection={handleViewElection} />
        )}
        {activePage === "election" && selectedElection && (
          <ElectionDetailsPage
            election={selectedElection}
            onBack={() => setCurrentPage("dashboard")}
          />
        )}
        {activePage === "profile" && <ProfilePage />}
      </main>
    </div>
  )
}
