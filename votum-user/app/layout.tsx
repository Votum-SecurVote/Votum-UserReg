import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { AuthProvider } from "@/context/auth-context"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SecureVote - Government E-Voting Portal",
  description:
    "Secure, transparent, and accessible electronic voting platform for democratic elections.",
}

export const viewport: Viewport = {
  themeColor: "#0B3D91",
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
