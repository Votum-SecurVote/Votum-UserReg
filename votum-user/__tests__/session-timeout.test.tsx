import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/context/auth-context'

// Helper component to trigger login state
function TestComponent() {
  const { user, verifyOtp } = useAuth()
  return (
    <div>
      {user ? <div>Logged In: {user.fullName}</div> : <div>Logged Out</div>}
      <button onClick={() => verifyOtp('123456')}>Login</button>
    </div>
  )
}

describe('Session Timeout', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('shows warning modal before timeout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Login
    await act(async () => {
      screen.getByText('Login').click()
      jest.advanceTimersByTime(1000) // Login delay
    })

    // Advance time close to timeout (4 mins)
    await act(async () => {
      jest.advanceTimersByTime(4 * 60 * 1000)
    })

    // Warning should appear
    expect(screen.getByText('Session Timeout Warning')).toBeInTheDocument()
  })

  it('logs out after timeout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Login
    await act(async () => {
      screen.getByText('Login').click()
      jest.advanceTimersByTime(1000)
    })
    
    expect(screen.getByText(/Logged In/)).toBeInTheDocument()

    // Advance past timeout (5 mins)
    await act(async () => {
      jest.advanceTimersByTime(5 * 60 * 1000 + 1000)
    })

    expect(screen.getByText('Logged Out')).toBeInTheDocument()
  })
})
