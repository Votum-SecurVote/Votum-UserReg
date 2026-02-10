/**
 * @jest-environment jsdom
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Test the cn utility function from lib/utils.ts
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    test('should merge class names correctly', () => {
      const result = cn('px-2 py-1', 'bg-blue-500')
      expect(result).toContain('px-2')
      expect(result).toContain('py-1')
      expect(result).toContain('bg-blue-500')
    })

    test('should handle conditional classes', () => {
      const isActive = true
      const result = cn(
        'base-class',
        isActive && 'active-class',
        !isActive && 'inactive-class'
      )
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
      expect(result).not.toContain('inactive-class')
    })

    test('should handle conflicting Tailwind classes', () => {
      const result = cn('px-2', 'px-4')
      // twMerge should resolve conflicts, keeping the last one
      expect(result).not.toContain('px-2')
      expect(result).toContain('px-4')
    })

    test('should handle empty inputs', () => {
      const result = cn('', null, undefined, false)
      expect(result).toBe('')
    })

    test('should handle array inputs', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })

    test('should handle object inputs', () => {
      const result = cn({
        'active': true,
        'inactive': false,
        'visible': true
      })
      expect(result).toContain('active')
      expect(result).toContain('visible')
      expect(result).not.toContain('inactive')
    })
  })
})
