/**
 * Unit tests for navigation logic and step management
 */

describe('Navigation Logic', () => {
  // Step navigation logic from registration page
  class StepManager {
    private currentStep: number = 1
    private errors: Record<string, string> = {}

    validateStep1(formData: any): boolean {
      const errs: Record<string, string> = {}
      
      if (!formData.fullName?.trim()) errs.fullName = "Full name is required."
      if (!formData.dob) errs.dob = "Date of birth is required."
      if (!formData.gender) errs.gender = "Gender is required."
      if (!formData.address?.trim()) errs.address = "Address is required."
      if (!formData.email?.trim()) errs.email = "Email is required."
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errs.email = "Enter a valid email address."
      if (!formData.phone?.trim()) errs.phone = "Phone number is required."
      else if (!/^\d{10}$/.test(formData.phone))
        errs.phone = "Enter a valid 10-digit phone number."
      if (!formData.aadhaar?.trim()) errs.aadhaar = "Aadhaar number is required."
      else if (formData.aadhaar.replace(/\D/g, "").length !== 12)
        errs.aadhaar = "Aadhaar must be exactly 12 digits."

      this.errors = errs
      return Object.keys(errs).length === 0
    }

    validateStep2(formData: any): boolean {
      const errs: Record<string, string> = {}
      
      if (!formData.aadhaarFile && !formData.profilePhoto && !formData.capturedPhoto) {
        errs.uploads = "Please upload at least your Aadhaar document."
      }
      if (!formData.aadhaarFile) errs.aadhaarFile = "Aadhaar PDF is required."

      this.errors = errs
      return Object.keys(errs).length === 0
    }

    validateStep3(formData: any): boolean {
      const errs: Record<string, string> = {}
      
      if (!formData.password) errs.password = "Password is required."
      else if (formData.password.length < 8)
        errs.password = "Password must be at least 8 characters."
      else if (!/[A-Z]/.test(formData.password))
        errs.password = "Include at least one uppercase letter."
      else if (!/\d/.test(formData.password))
        errs.password = "Include at least one number."
      else if (!/[^A-Za-z0-9]/.test(formData.password))
        errs.password = "Include at least one special character."

      if (!formData.confirmPassword) errs.confirmPassword = "Confirm your password."
      else if (formData.password !== formData.confirmPassword)
        errs.confirmPassword = "Passwords do not match."
      
      if (!formData.acceptTerms) errs.acceptTerms = "You must accept the terms."

      this.errors = errs
      return Object.keys(errs).length === 0
    }

    nextStep(formData: any): boolean {
      if (this.currentStep === 1 && this.validateStep1(formData)) {
        this.currentStep = 2
        return true
      }
      if (this.currentStep === 2 && this.validateStep2(formData)) {
        this.currentStep = 3
        return true
      }
      return false
    }

    prevStep(): boolean {
      if (this.currentStep > 1) {
        this.currentStep = Math.max(1, this.currentStep - 1)
        this.errors = {}
        return true
      }
      return false
    }

    getCurrentStep(): number {
      return this.currentStep
    }

    getErrors(): Record<string, string> {
      return { ...this.errors }
    }
  }

  describe('Step Validation', () => {
    let stepManager: StepManager

    beforeEach(() => {
      stepManager = new StepManager()
    })

    describe('validateStep1', () => {
      test('should pass with valid personal information', () => {
        const validData = {
          fullName: 'John Doe',
          dob: '1990-01-01',
          gender: 'Male',
          address: '123 Main St',
          email: 'john@example.com',
          phone: '9876543210',
          aadhaar: '123456789012'
        }

        const result = stepManager.validateStep1(validData)
        expect(result).toBe(true)
        expect(Object.keys(stepManager.getErrors())).toHaveLength(0)
      })

      test('should fail with empty required fields', () => {
        const invalidData = {}

        const result = stepManager.validateStep1(invalidData)
        expect(result).toBe(false)
        
        const errors = stepManager.getErrors()
        expect(errors.fullName).toBeTruthy()
        expect(errors.dob).toBeTruthy()
        expect(errors.gender).toBeTruthy()
      })

      test('should validate email format', () => {
        const invalidEmail = {
          fullName: 'John',
          dob: '1990-01-01',
          gender: 'Male',
          address: '123 Main St',
          email: 'invalid-email',
          phone: '9876543210',
          aadhaar: '123456789012'
        }

        const result = stepManager.validateStep1(invalidEmail)
        expect(result).toBe(false)
        expect(stepManager.getErrors().email).toBe('Enter a valid email address.')
      })

      test('should validate phone format', () => {
        const invalidPhone = {
          fullName: 'John',
          dob: '1990-01-01',
          gender: 'Male',
          address: '123 Main St',
          email: 'john@example.com',
          phone: '123', // Invalid phone
          aadhaar: '123456789012'
        }

        const result = stepManager.validateStep1(invalidPhone)
        expect(result).toBe(false)
        expect(stepManager.getErrors().phone).toBe('Enter a valid 10-digit phone number.')
      })

      test('should validate Aadhaar format', () => {
        const invalidAadhaar = {
          fullName: 'John',
          dob: '1990-01-01',
          gender: 'Male',
          address: '123 Main St',
          email: 'john@example.com',
          phone: '9876543210',
          aadhaar: '123' // Invalid Aadhaar
        }

        const result = stepManager.validateStep1(invalidAadhaar)
        expect(result).toBe(false)
        expect(stepManager.getErrors().aadhaar).toBe('Aadhaar must be exactly 12 digits.')
      })
    })

    describe('validateStep2', () => {
      test('should pass with Aadhaar file uploaded', () => {
        const validData = {
          aadhaarFile: new File([''], 'aadhaar.pdf'),
        }

        const result = stepManager.validateStep2(validData)
        expect(result).toBe(true)
      })

      test('should fail without any documents', () => {
        const invalidData = {}

        const result = stepManager.validateStep2(invalidData)
        expect(result).toBe(false)
        
        const errors = stepManager.getErrors()
        expect(errors.uploads).toBeTruthy()
        expect(errors.aadhaarFile).toBeTruthy()
      })
    })

    describe('validateStep3', () => {
      test('should pass with valid password and terms accepted', () => {
        const validData = {
          password: 'StrongPass123!',
          confirmPassword: 'StrongPass123!',
          acceptTerms: true
        }

        const result = stepManager.validateStep3(validData)
        expect(result).toBe(true)
      })

      test('should fail with weak password', () => {
        const weakPassword = {
          password: 'weak',
          confirmPassword: 'weak',
          acceptTerms: true
        }

        const result = stepManager.validateStep3(weakPassword)
        expect(result).toBe(false)
        expect(stepManager.getErrors().password).toBeTruthy()
      })

      test('should fail with mismatched passwords', () => {
        const mismatchedPasswords = {
          password: 'StrongPass123!',
          confirmPassword: 'DifferentPass123!',
          acceptTerms: true
        }

        const result = stepManager.validateStep3(mismatchedPasswords)
        expect(result).toBe(false)
        expect(stepManager.getErrors().confirmPassword).toBe('Passwords do not match.')
      })

      test('should fail without accepting terms', () => {
        const noTerms = {
          password: 'StrongPass123!',
          confirmPassword: 'StrongPass123!',
          acceptTerms: false
        }

        const result = stepManager.validateStep3(noTerms)
        expect(result).toBe(false)
        expect(stepManager.getErrors().acceptTerms).toBe('You must accept the terms.')
      })
    })
  })

  describe('Step Navigation', () => {
    let stepManager: StepManager

    beforeEach(() => {
      stepManager = new StepManager()
    })

    test('should start at step 1', () => {
      expect(stepManager.getCurrentStep()).toBe(1)
    })

    test('should advance to step 2 with valid step 1 data', () => {
      const validData = {
        fullName: 'John Doe',
        dob: '1990-01-01',
        gender: 'Male',
        address: '123 Main St',
        email: 'john@example.com',
        phone: '9876543210',
        aadhaar: '123456789012'
      }

      const result = stepManager.nextStep(validData)
      expect(result).toBe(true)
      expect(stepManager.getCurrentStep()).toBe(2)
    })

    test('should not advance with invalid step 1 data', () => {
      const invalidData = {}

      const result = stepManager.nextStep(invalidData)
      expect(result).toBe(false)
      expect(stepManager.getCurrentStep()).toBe(1)
    })

    test('should advance to step 3 with valid step 2 data', () => {
      // First go to step 2
      const step1Data = {
        fullName: 'John Doe',
        dob: '1990-01-01',
        gender: 'Male',
        address: '123 Main St',
        email: 'john@example.com',
        phone: '9876543210',
        aadhaar: '123456789012'
      }
      stepManager.nextStep(step1Data)

      // Then try to go to step 3
      const step2Data = {
        aadhaarFile: new File([''], 'aadhaar.pdf'),
      }

      const result = stepManager.nextStep(step2Data)
      expect(result).toBe(true)
      expect(stepManager.getCurrentStep()).toBe(3)
    })

    test('should go back to previous step', () => {
      // Go to step 2 first
      const step1Data = {
        fullName: 'John Doe',
        dob: '1990-01-01',
        gender: 'Male',
        address: '123 Main St',
        email: 'john@example.com',
        phone: '9876543210',
        aadhaar: '123456789012'
      }
      stepManager.nextStep(step1Data)

      // Now go back
      const result = stepManager.prevStep()
      expect(result).toBe(true)
      expect(stepManager.getCurrentStep()).toBe(1)
    })

    test('should not go back from step 1', () => {
      const result = stepManager.prevStep()
      expect(result).toBe(false)
      expect(stepManager.getCurrentStep()).toBe(1)
    })

    test('should clear errors when going back', () => {
      // Create errors by trying invalid next step
      stepManager.nextStep({})
      expect(Object.keys(stepManager.getErrors())).toHaveLength(7) // Should have validation errors

      // Go to step 2 first with valid data
      const step1Data = {
        fullName: 'John Doe',
        dob: '1990-01-01',
        gender: 'Male',
        address: '123 Main St',
        email: 'john@example.com',
        phone: '9876543210',
        aadhaar: '123456789012'
      }
      stepManager.nextStep(step1Data)

      // Create errors in step 2
      stepManager.nextStep({})
      const errorsBeforeBack = stepManager.getErrors()
      expect(Object.keys(errorsBeforeBack)).toHaveLength(2) // Should have step 2 errors

      // Go back should clear errors
      stepManager.prevStep()
      expect(Object.keys(stepManager.getErrors())).toHaveLength(0)
    })
  })
})
