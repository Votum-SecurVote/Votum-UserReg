import React from 'react'
import { render, screen } from '@testing-library/react'
import { LoginPage } from '@/components/login-page'
import { AuthProvider } from '@/context/auth-context'
import fs from 'fs'
import path from 'path'

describe('Debug LoginPage', () => {
    it('renders and logs html', () => {
        const { container } = render(
            <AuthProvider>
                <LoginPage onNavigateToRegister={jest.fn()} onLoginSuccess={jest.fn()} />
            </AuthProvider>
        )
        const html = container.innerHTML
        fs.writeFileSync(path.resolve(__dirname, 'login_debug.html'), html)
        
        // Also check getByLabelText
        try {
            screen.getByLabelText('Email or Phone')
            fs.writeFileSync(path.resolve(__dirname, 'login_debug_result.txt'), 'Found Email or Phone')
        } catch (e) {
            fs.writeFileSync(path.resolve(__dirname, 'login_debug_result.txt'), 'Error: ' + e.message)
        }
    })
})
