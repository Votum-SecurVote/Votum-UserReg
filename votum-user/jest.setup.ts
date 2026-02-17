import '@testing-library/jest-dom'


// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

// Mock navigator.mediaDevices.getUserMedia
Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
        getUserMedia: jest.fn(),
    },
    writable: true,
    configurable: true,
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(),
    }),
}))

// Mock global fetch
// Mock global fetch
const mockFetch = jest.fn((url: string | URL) => {
    const urlString = url.toString();
    if (urlString.includes("/profile")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                fullName: "Rajesh Kumar",
                email: "rajesh.kumar@email.com",
                phone: "9876543210",
                dob: "1990-05-15",
                gender: "Male",
                address: "42, MG Road, Sector 12, New Delhi, 110001",
                status: "APPROVED"
            }),
            text: () => Promise.resolve("mock-token"),
        });
    }
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve("mock-token"),
    });
}) as jest.Mock;

global.fetch = mockFetch;
if (typeof window !== 'undefined') {
    window.fetch = mockFetch;
}

// Mock Pointer Events for Radix UI
if (typeof window !== 'undefined') {
    global.ResizeObserver = class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    }

    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    window.HTMLElement.prototype.hasPointerCapture = jest.fn()
    window.HTMLElement.prototype.setPointerCapture = jest.fn()
    window.HTMLElement.prototype.releasePointerCapture = jest.fn()

    if (typeof document !== 'undefined') {
        document.elementFromPoint = jest.fn()
    }
}
