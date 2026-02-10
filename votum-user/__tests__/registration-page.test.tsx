import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { RegistrationPage } from '@/components/registration-page'
import { AuthProvider } from '@/context/auth-context'



// Mock getUserMedia
const mockGetUserMedia = jest.fn()
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
  configurable: true // ensuring it's configurable here too just in case
})

describe('RegistrationPage', () => {
  const mockOnNavigateToLogin = jest.fn()

  beforeEach(() => {
    mockGetUserMedia.mockReset()
    jest.clearAllMocks()
  })

  const renderRegistrationPage = () => {
    return render(
      <AuthProvider>
        <RegistrationPage onNavigateToLogin={mockOnNavigateToLogin} />
      </AuthProvider>
    )
  }

  it('validates step 1 fields', async () => {
    const user = userEvent.setup()
    renderRegistrationPage()
    const nextButton = screen.getByText('Next')

    // Try empty submit
    fireEvent.click(nextButton)
    expect(screen.getByText('Full name is required.')).toBeInTheDocument()

    // Fill invalid email
    await user.type(screen.getByLabelText(/Email/i), 'invalid-email')
    fireEvent.click(nextButton)
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()

    // Fill invalid phone
    await user.clear(screen.getByLabelText(/Phone Number/i))
    await user.type(screen.getByLabelText(/Phone Number/i), '123')
    fireEvent.click(nextButton)
    expect(screen.getByText('Enter a valid 10-digit phone number.')).toBeInTheDocument()
    
    // Fill invalid Aadhaar
    await user.type(screen.getByLabelText(/Aadhaar Number/i), '123')
    fireEvent.click(nextButton)
    expect(screen.getByText('Aadhaar must be exactly 12 digits.')).toBeInTheDocument()
  })

  it('navigates through all steps and submits', async () => {
    renderRegistrationPage()
    const user = userEvent.setup()

    // --- STEP 1 ---
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
    await user.type(screen.getByLabelText(/Date of Birth/i), '1990-01-01')
    
    // Select Gender
    // Radix UI Select trigger is a button/combobox
    const genderTrigger = screen.getByRole('combobox')
    await user.click(genderTrigger)
    const maleOption = await screen.findByRole('option', { name: 'Male' })
    await user.click(maleOption)

    await user.type(screen.getByLabelText(/Address/i), '123 Main St')
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Phone Number/i), '9876543210')
    await user.type(screen.getByLabelText(/Aadhaar Number/i), '123456789012')
    
    await user.click(screen.getByText('Next'))

    // --- STEP 2 ---
    await waitFor(() => {
        expect(screen.getByText('2. Identity Upload')).toHaveClass('text-primary')
    })
    
    // Mock File Uploads
    const file = new File(['dummy content'], 'aadhaar.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/Click to upload Aadhaar PDF/i)
    await user.upload(input, file)
    
    // Mock Camera Interaction
    // We'll simulate successful capture logic if feasible, or just rely on file upload which is sufficient for validation if structured so.
    // The code requires either files OR captured photo.
    // Let's just use the file upload we did.
    
    await user.click(screen.getByText('Next'))

    // --- STEP 3 ---
    expect(await screen.findByText('3. Account Security')).toHaveClass('text-primary')

    await user.type(screen.getByLabelText(/^Password$/), 'Password123!')
    // Check strength bar presence (implicit check via class or structure if needed, but text 'Strong' might appear)
    
    await user.type(screen.getByLabelText(/Confirm Password/), 'Password123!')
    
    await user.click(screen.getByRole('checkbox')) // Accept Terms
    
    await user.click(screen.getByText('Submit Registration'))

    // --- SUCCESS ---
    await waitFor(() => {
      expect(screen.getByText('Registration Submitted')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('handles camera permission denied', async () => {
    renderRegistrationPage()
    const user = userEvent.setup()

    // Fill Step 1
    await user.type(screen.getByLabelText(/Full Name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/Date of Birth/i), '1992-02-02')
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'Female' }))
    await user.type(screen.getByLabelText(/Address/i), '456 Lane')
    await user.type(screen.getByLabelText(/Email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/Phone Number/i), '9876543211')
    await user.type(screen.getByLabelText(/Aadhaar Number/i), '123456789013')
    await user.click(screen.getByText('Next'))

    // Step 2: Camera
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'))
    const cameraSection = screen.getByText('Click to open camera for face registration')
    await user.click(cameraSection)

    await waitFor(() => {
      expect(screen.getByText('Camera access denied. Please allow camera permissions.')).toBeInTheDocument()
    })
  })

  it('validates password matching', async () => {
    renderRegistrationPage()
    const user = userEvent.setup()

    // Skip to Step 3 (Need valid data for 1 & 2)
    // ... (reusing filling logic helper would be better but explicit here)
    // Fast forward Step 1
    await user.type(screen.getByLabelText(/Full Name/i), 'A')
    await user.type(screen.getByLabelText(/Date of Birth/i), '2000-01-01')
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'Other' }))
    await user.type(screen.getByLabelText(/Address/i), 'A')
    await user.type(screen.getByLabelText(/Email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/Phone Number/i), '0000000000')
    await user.type(screen.getByLabelText(/Aadhaar Number/i), '000000000000')
    await user.click(screen.getByText('Next'))
    
    // Fast forward Step 2
    const file = new File(['.'], 'a.pdf', { type: 'application/pdf' })
    await user.upload(screen.getByLabelText(/Click to upload Aadhaar PDF/i), file)
    await user.click(screen.getByText('Next'))

    // Step 3
    await user.type(screen.getByLabelText(/^Password$/), 'Pass123!')
    await user.type(screen.getByLabelText(/Confirm Password/), 'Pass1234!') // Mismatch
    await user.click(screen.getByRole('checkbox'))
    
    await user.click(screen.getByText('Submit Registration'))
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
  })
})
