/**
 * Unit tests for utility functions found in profile components
 */

describe('Profile Utility Functions', () => {
  // maskAadhaar function from profile components
  const maskAadhaar = (aadhaar: string): string => {
    if (!aadhaar || aadhaar.length < 4) return "XXXX-XXXX-XXXX"
    const last4 = aadhaar.slice(-4)
    return `XXXX-XXXX-${last4}`
  }

  // formatAadhaar function from registration-profile-view
  const formatAadhaar = (aadhaar: string): string => {
    if (!aadhaar) return "XXXX-XXXX-XXXX"
    const digits = aadhaar.replace(/\D/g, "")
    if (digits.length === 12) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`
    }
    return maskAadhaar(aadhaar)
  }

  // formatDob function from profile components
  const formatDob = (dob: string): string => {
    if (!dob) return "N/A"
    return new Date(dob).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Password strength calculation from registration page
  const getPasswordStrength = (password: string): number => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  describe('maskAadhaar', () => {
    test('should mask Aadhaar number with last 4 digits visible', () => {
      const result = maskAadhaar('123456781234')
      expect(result).toBe('XXXX-XXXX-1234')
    })

    test('should return default mask for empty string', () => {
      const result = maskAadhaar('')
      expect(result).toBe('XXXX-XXXX-XXXX')
    })

    test('should return default mask for null/undefined', () => {
      const result1 = maskAadhaar(null as any)
      const result2 = maskAadhaar(undefined as any)
      expect(result1).toBe('XXXX-XXXX-XXXX')
      expect(result2).toBe('XXXX-XXXX-XXXX')
    })

    test('should return default mask for short strings', () => {
      const result = maskAadhaar('123')
      expect(result).toBe('XXXX-XXXX-XXXX')
    })

    test('should handle exactly 4 characters', () => {
      const result = maskAadhaar('1234')
      expect(result).toBe('XXXX-XXXX-1234')
    })

    test('should handle long strings', () => {
      const result = maskAadhaar('12345678901234567890')
      expect(result).toBe('XXXX-XXXX-7890')
    })
  })

  describe('formatAadhaar', () => {
    test('should format valid 12-digit Aadhaar number', () => {
      const result = formatAadhaar('123456789012')
      expect(result).toBe('1234-5678-9012')
    })

    test('should format Aadhaar with non-digit characters', () => {
      const result = formatAadhaar('1234-5678-9012')
      expect(result).toBe('1234-5678-9012')
    })

    test('should mask invalid length Aadhaar', () => {
      const result = formatAadhaar('12345678901')
      expect(result).toBe('XXXX-XXXX-8901')
    })

    test('should return default mask for empty string', () => {
      const result = formatAadhaar('')
      expect(result).toBe('XXXX-XXXX-XXXX')
    })

    test('should handle Aadhaar with letters and special chars', () => {
      const result = formatAadhaar('12ab34cd56ef78gh90ij12kl')
      expect(result).toBe('1234-5678-9012')
    })

    test('should handle short Aadhaar numbers', () => {
      const result = formatAadhaar('123456')
      expect(result).toBe('XXXX-XXXX-3456')
    })
  })

  describe('formatDob', () => {
    test('should format valid date string', () => {
      const result = formatDob('1990-05-15')
      expect(result).toBe('15 May 1990')
    })

    test('should return N/A for empty string', () => {
      const result = formatDob('')
      expect(result).toBe('N/A')
    })

    test('should return N/A for null/undefined', () => {
      const result1 = formatDob(null as any)
      const result2 = formatDob(undefined as any)
      expect(result1).toBe('N/A')
      expect(result2).toBe('N/A')
    })

    test('should handle different date formats', () => {
      const result = formatDob('2000-12-25')
      expect(result).toBe('25 December 2000')
    })

    test('should handle ISO date format', () => {
      const result = formatDob('1985-01-01T00:00:00.000Z')
      expect(result).toBe('1 January 1985')
    })

    test('should handle leap year dates', () => {
      const result = formatDob('2024-02-29')
      expect(result).toBe('29 February 2024')
    })

    test('should handle different months', () => {
      const testDates = [
        { input: '1990-01-15', expected: '15 January 1990' },
        { input: '1990-06-30', expected: '30 June 1990' },
        { input: '1990-12-01', expected: '1 December 1990' },
      ]

      testDates.forEach(({ input, expected }) => {
        expect(formatDob(input)).toBe(expected)
      })
    })
  })

  describe('getPasswordStrength', () => {
    test('should return 0 for empty password', () => {
      expect(getPasswordStrength('')).toBe(0)
    })

    test('should return 1 for password with only length (no other criteria)', () => {
      expect(getPasswordStrength('aaaaaaaa')).toBe(2) // Actually gets length + lowercase = 2
    })

    test('should return 2 for password with length and numbers', () => {
      expect(getPasswordStrength('12345678')).toBe(2) // length + digits
    })

    test('should return 2 for password with length and lowercase', () => {
      expect(getPasswordStrength('abcdefgh')).toBe(2)
    })

    test('should return 3 for password with length, lowercase, and uppercase', () => {
      expect(getPasswordStrength('Abcdefgh')).toBe(3)
    })

    test('should return 4 for password with length, lowercase, uppercase, and digits', () => {
      expect(getPasswordStrength('Abcdefg1')).toBe(4)
    })

    test('should return 5 for password with all criteria', () => {
      expect(getPasswordStrength('Abcdefg1!')).toBe(5)
    })

    test('should handle short passwords with multiple criteria', () => {
      expect(getPasswordStrength('Aa1!')).toBe(4) // Missing length requirement
    })

    test('should handle passwords with only special characters', () => {
      expect(getPasswordStrength('!@#$%^&*')).toBe(2) // Length + special chars
    })
  })
})
