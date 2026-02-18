/**
 * Utility functions for the application.
 * Common helper functions used across components.
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names safely using clsx and tailwind-merge.
 * Handles conditional classes and conflicting Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
