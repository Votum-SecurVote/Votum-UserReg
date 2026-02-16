"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import type { Election } from "@/lib/types"
import { LoginPage } from "@/components/login-page"
import { RegistrationPage } from "@/components/registration-page"
import { DashboardPage } from "@/components/dashboard-page"
import { ElectionDetailsPage } from "@/components/election-details-page"
import { ProfilePage } from "@/components/profile-page"
import { Navbar } from "@/components/navbar"

type AppPage =
  | "login"
  | "register"
  | "dashboard"
  | "election"
  | "profile"

export default function Page() {
  const { isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState<AppPage>("login")
  const [selectedElection, setSelectedElection] =
    useState<Election | null>(null)

  const protectedPages: AppPage[] = ["dashboard", "election", "profile"]

  const activePage =
    !isAuthenticated && protectedPages.includes(currentPage)
      ? "login"
      : currentPage

  const handleViewElection = (election: Election) => {
    setSelectedElection(election)
    setCurrentPage("election")
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page as AppPage)
  }

  if (activePage === "login") {
    return (
      <LoginPage
        onNavigateToRegister={() => setCurrentPage("register")}
        onLoginSuccess={() => setCurrentPage("dashboard")}  // ✅ THIS FIXES IT
      />
    )
  }

  if (activePage === "register") {
    return (
      <RegistrationPage
        onNavigateToLogin={() => setCurrentPage("login")}

      />
    )
  }


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
