/**
 * @file validation.test.ts
 * Unit tests for form validation logic used in registration form
 */

describe('Form Validation Logic', () => {
  // Helper functions extracted from registration-page.tsx for testing
  const validateEmail = (email: string): boolean => {
    if (!email.trim()) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return false
    return /^\d{10}$/.test(phone)
  }

  const validateAadhaar = (aadhaar: string): boolean => {
    if (!aadhaar.trim()) return false
    return aadhaar.replace(/\D/g, "").length === 12
  }

  const validateRequiredField = (value: string): boolean => {
    return value.trim().length > 0
  }

  describe('Email Validation', () => {
    test('should accept valid email formats', () => {
      const validEmails = [
        'user@domain.com',
        'user.name@domain.co.in',
        'user+tag@domain.org',
        'user123@domain123.net',
      ]

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true)
      })
    })

    test('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid.email',
        'user@',
        '@domain.com',
        'user@domain',
        'user@domain.',
        '',
        ' ',
      ]

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false)
      })
    })

    test('should handle edge cases in email validation', () => {
      // The regex allows consecutive dots, which is technically valid for some email systems
      expect(validateEmail('user..name@domain.com')).toBe(true) // Basic regex allows this
      expect(validateEmail('user@domain.co')).toBe(true) // Valid format
      expect(validateEmail('a@b.c')).toBe(true) // Minimal valid email
    })
  })

  describe('Phone Number Validation', () => {
    test('should accept valid 10-digit phone numbers', () => {
      const validPhones = [
        '9876543210',
        '8765432109', 
        '7654321098',
        '9123456789'
      ]

      validPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(true)
      })
    })

    test('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '987654321',   // 9 digits
        '98765432101', // 11 digits
        'abcdefghij',  // non-numeric
        '987-654-3210', // with hyphens
        '+919876543210', // with country code
        '',
        ' ',
        '9876543abc',   // mixed characters
      ]

      invalidPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(false)
      })
    })
  })

  describe('Aadhaar Validation', () => {
    test('should accept valid 12-digit Aadhaar numbers', () => {
      const validAadhaar = [
        '123456789012',
        '987654321098',
        '456789123456',
        '1234 5678 9012', // with spaces
        '1234-5678-9012', // with hyphens
      ]

      validAadhaar.forEach(aadhaar => {
        expect(validateAadhaar(aadhaar)).toBe(true)
      })
    })

    test('should reject invalid Aadhaar numbers', () => {
      const invalidAadhaar = [
        '12345678901',   // 11 digits
        '1234567890123', // 13 digits
        'abcdefghijkl',  // non-numeric
        '',
        ' ',
        '123456789abc',  // mixed characters
      ]

      invalidAadhaar.forEach(aadhaar => {
        expect(validateAadhaar(aadhaar)).toBe(false)
      })
    })

    test('should handle formatted Aadhaar numbers', () => {
      expect(validateAadhaar('1234 5678 9012')).toBe(true)
      expect(validateAadhaar('1234-5678-9012')).toBe(true)
      expect(validateAadhaar('1234.5678.9012')).toBe(true)
    })
  })

  describe('Required Field Validation', () => {
    test('should accept non-empty strings', () => {
      const validInputs = [
        'John Doe',
        'Delhi',
        'Male',
        'Some address',
        '2000-01-01'
      ]

      validInputs.forEach(input => {
        expect(validateRequiredField(input)).toBe(true)
      })
    })

    test('should reject empty or whitespace-only strings', () => {
      const invalidInputs = [
        '',
        ' ',
        '  ',
        '\t',
        '\n',
        '   \t   \n   '
      ]

      invalidInputs.forEach(input => {
        expect(validateRequiredField(input)).toBe(false)
      })
    })
  })
})
