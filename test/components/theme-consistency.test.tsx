import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import HomePage from '@/routes/index'
import LoginPage from '@/routes/login'
import { render } from '../utils/theme-test-utils'

describe('theme consistency across routes', () => {
  it('renders the home landing state in light theme', () => {
    render(() => <HomePage />, { theme: 'light' })

    expect(document.documentElement).toHaveClass('light')
    expect(screen.getByRole('heading', { name: 'OnlyWrite' })).toBeInTheDocument()
    expect(screen.getByText('WRITE')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select folder' })).toBeInTheDocument()
  })

  it('renders the same landing state in dark theme', () => {
    render(() => <HomePage />, { theme: 'dark' })

    expect(document.documentElement).toHaveClass('dark')
    expect(screen.getByText('WRITE')).toBeInTheDocument()
    expect(screen.getByText('Efficiency-first design')).toBeInTheDocument()
  })

  it('renders the login page with the shared shell styles', () => {
    render(() => <LoginPage />, { theme: 'dark' })

    expect(screen.getByRole('heading', { name: 'Sign in to OnlyWrite' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('m@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })
})
