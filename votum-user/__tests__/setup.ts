import '@testing-library/jest-dom'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Mock UI components from shadcn/ui - using function returns instead of JSX
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => children,
  CardContent: ({ children }: any) => children,
  CardHeader: ({ children }: any) => children,
  CardTitle: ({ children }: any) => children,
  CardDescription: ({ children }: any) => children,
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => ({
    type: 'button',
    onClick,
    children,
  }),
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => ({ type: 'input', ...props }),
}))

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => children,
  SelectContent: ({ children }: any) => children,
  SelectItem: ({ children, value }: any) => ({ value, children }),
  SelectTrigger: ({ children }: any) => children,
  SelectValue: ({ placeholder }: any) => placeholder,
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: () => ({ type: 'hr' }),
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => ({ htmlFor, children }),
}))

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => ({ type: 'textarea', ...props }),
}))

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props: any) => ({ type: 'checkbox', ...props }),
}))

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: any) => ({ type: 'progress', value }),
}))

jest.mock('@/components/ui/input-otp', () => ({
  InputOTP: ({ children }: any) => children,
  InputOTPGroup: ({ children }: any) => children,
  InputOTPSlot: ({ index }: any) => ({ type: 'input', 'data-slot': index }),
}))

// Mock Lucide React icons - return simple objects instead of JSX
jest.mock('lucide-react', () => ({
  User: () => 'User Icon',
  Mail: () => 'Mail Icon',
  Phone: () => 'Phone Icon',
  CreditCard: () => 'CreditCard Icon',
  Calendar: () => 'Calendar Icon',
  MapPin: () => 'MapPin Icon',
  Shield: () => 'Shield Icon',
  CheckCircle2: () => 'CheckCircle2 Icon',
  Loader2: () => 'Loader2 Icon',
  X: () => 'X Icon',
  ArrowLeft: () => 'ArrowLeft Icon',
  ArrowRight: () => 'ArrowRight Icon',
  Camera: () => 'Camera Icon',
  Upload: () => 'Upload Icon',
  Eye: () => 'Eye Icon',
  EyeOff: () => 'EyeOff Icon',
  AlertCircle: () => 'AlertCircle Icon',
  Edit2: () => 'Edit2 Icon',
  Lock: () => 'Lock Icon',
  LayoutDashboard: () => 'LayoutDashboard Icon',
  LogOut: () => 'LogOut Icon',
  Menu: () => 'Menu Icon',
  PanelLeft: () => 'PanelLeft Icon',
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock browser APIs
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(),
})

Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  value: jest.fn(),
})

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: jest.fn(),
  },
  writable: true,
})
