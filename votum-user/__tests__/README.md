# Unit Test Suite Documentation

## Overview
This test suite provides comprehensive unit tests for the Votum User Registration system. All tests focus on pure business logic, utility functions, and component behavior without relying on browser APIs or integration testing.

## Test Files

### 1. `utils.test.ts`
Tests the core utility function from `lib/utils.ts`:
- **cn() function**: Classname utility for merging Tailwind CSS classes
  - Merging multiple class names
  - Conditional classes
  - Tailwind class conflicts resolution
  - Empty/null inputs handling
  - Array and object inputs

### 2. `validation.test.ts` 
Tests form validation logic extracted from registration components:
- **Email validation**: Format checking with regex
- **Phone validation**: 10-digit phone number validation
- **Aadhaar validation**: 12-digit ID number validation  
- **Password validation**: Strength requirements (length, uppercase, lowercase, numbers, special chars)
- **Aadhaar formatting**: Adding dashes for display

### 3. `profile-utils.test.ts`
Tests utility functions from profile components:
- **maskAadhaar()**: Masking Aadhaar numbers for security (showing last 4 digits)
- **formatAadhaar()**: Formatting with dashes or masking for invalid inputs
- **formatDob()**: Date formatting in Indian locale
- **getPasswordStrength()**: Password strength scoring (0-5 scale)

### 4. `auth-logic.test.ts`
Tests authentication business logic:
- **login()**: Email/password validation, loading states, OTP requirement
- **verifyOtp()**: 6-digit OTP validation, user state updates
- **register()**: User registration with required/optional fields
- **logout()**: State cleanup
- **updateProfile()**: Partial user data updates

### 5. `status-badge.test.ts`
Tests status management and conditional rendering logic:
- **getStatusStyles()**: CSS class mapping for different user statuses
- **getStatusText()**: Status display text mapping  
- **getStatusDescription()**: Status help text
- **formatRole()**: Role name formatting
- **Step management**: Registration step titles, descriptions, progress calculation

### 6. `navigation.test.ts`
Tests multi-step form navigation and validation:
- **StepManager class**: Manages 3-step registration process
- **validateStep1()**: Personal information validation
- **validateStep2()**: Document upload validation
- **validateStep3()**: Password and terms validation
- **nextStep()/prevStep()**: Step navigation with validation
- **Error handling**: Error state management across steps

## Test Coverage Areas

### ✅ **Pure Business Logic**
- Form validation rules
- Data formatting functions
- Authentication state management
- Step progression logic
- Status management

### ✅ **Utility Functions**
- String manipulation (masking, formatting)
- Date formatting
- Class name utilities
- Validation helpers

### ✅ **Edge Cases**
- Empty/null inputs
- Invalid data formats
- Boundary conditions
- Error scenarios

### ✅ **Conditional Logic**
- Status-based rendering decisions
- Step-based form display
- Validation rule application
- Error message selection

## What Is NOT Tested
- CSS styling and animations
- Browser API interactions (camera, file upload)
- Network requests/API calls
- Next.js routing
- React component rendering (no DOM testing)
- UI component library behavior

## Running Tests

```bash
# Install dependencies first
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

## Test Philosophy

These tests follow the principle of testing **business logic** and **utility functions** in isolation. They are:

- **Fast**: No browser or network dependencies
- **Deterministic**: Same input always produces same output
- **Isolated**: Each test is independent
- **Focused**: Testing specific units of functionality

The test suite ensures that the core business rules and data processing logic work correctly across various input scenarios and edge cases, providing confidence in the application's reliability without the complexity of full integration testing.
