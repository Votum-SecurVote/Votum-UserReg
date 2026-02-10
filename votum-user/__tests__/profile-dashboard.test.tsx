import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DashboardPage } from '@/components/dashboard-page'
import { ProfilePage } from '@/components/profile-page'
import { AuthProvider, useAuth } from '@/context/auth-context'

// Mock User inject
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const { verifyOtp } = useAuth()
  React.useEffect(() => {
    verifyOtp('123456') // Auto login with mock user
  }, [verifyOtp])
  return <>{children}</>
}

describe('Dashboard and Profile', () => {
  it('renders dashboard with user name and stats', async () => {
    const mockViewElection = jest.fn()
    render(
      <AuthProvider>
        <TestWrapper>
          <DashboardPage onViewElection={mockViewElection} />
        </TestWrapper>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Welcome, Rajesh Kumar/)).toBeInTheDocument()
    }, { timeout: 4000 })
    
    // Check Status Badge
    expect(screen.getByText('APPROVED')).toBeInTheDocument()
    
    // Check Election Cards
    expect(screen.getByText('General Assembly Election 2026')).toBeInTheDocument()
  })

  it('renders profile with user details', async () => {
    render(
      <AuthProvider>
        <TestWrapper>
          <ProfilePage />
        </TestWrapper>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Rajesh Kumar')).toBeInTheDocument()
    }, { timeout: 4000 })
    
    expect(screen.getByText('9876543210')).toBeInTheDocument()
    expect(screen.getByText(/1990/)).toBeInTheDocument() // Date formatting varies by locale
  })
})
