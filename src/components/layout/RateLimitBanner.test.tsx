import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RateLimitBanner } from './RateLimitBanner'

describe('RateLimitBanner', () => {
  const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600

  describe('Demo Mode', () => {
    it('does not render when remaining > 10% in demo mode', () => {
      const { container } = render(
        <RateLimitBanner
          remaining={4500}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
        />
      )
      expect(container).toBeEmptyDOMElement()
    })

    it('renders warning state when remaining < 10% in demo mode', () => {
      render(
        <RateLimitBanner
          remaining={450}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
        />
      )
      expect(screen.getByText(/Demo mode active/i)).toBeInTheDocument()
      // Text is split across multiple elements, so check for parts
      expect(screen.getByText('450', { exact: false })).toBeInTheDocument()
      expect(screen.getByText(/5000/)).toBeInTheDocument()
      expect(screen.getByText(/requests remaining/i)).toBeInTheDocument()
    })

    it('renders critical state when remaining < 5% in demo mode', () => {
      render(
        <RateLimitBanner
          remaining={100}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
        />
      )
      expect(screen.getByText(/Demo limit almost exhausted/i)).toBeInTheDocument()
    })

    it('calls onAuthClick when sign in button clicked', () => {
      const handleAuth = vi.fn()
      render(
        <RateLimitBanner
          remaining={450}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
          onAuthClick={handleAuth}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /sign in with github/i }))
      expect(handleAuth).toHaveBeenCalledTimes(1)
    })

    it('shows sign in button when onAuthClick provided', () => {
      render(
        <RateLimitBanner
          remaining={450}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
          onAuthClick={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument()
    })

    it('does not show sign in button when onAuthClick not provided', () => {
      render(
        <RateLimitBanner
          remaining={450}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
        />
      )

      expect(screen.queryByRole('button', { name: /sign in with github/i })).not.toBeInTheDocument()
    })

    it('displays time until reset in demo mode', () => {
      render(
        <RateLimitBanner
          remaining={450}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
        />
      )
      expect(screen.getByText(/Resets in \d+ minutes/i)).toBeInTheDocument()
    })
  })

  describe('Authenticated Mode', () => {
    it('does not render when remaining > 10% in auth mode', () => {
      const { container } = render(
        <RateLimitBanner
          remaining={4500}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={false}
          onLogoutClick={vi.fn()}
        />
      )
      expect(container).toBeEmptyDOMElement()
    })

    it('renders authenticated state when remaining < 10%', () => {
      render(
        <RateLimitBanner
          remaining={250}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={false}
          onLogoutClick={vi.fn()}
        />
      )
      expect(screen.getByText(/Authenticated/i)).toBeInTheDocument()
      // Text is split across multiple elements, so check for parts
      expect(screen.getByText('250', { exact: false })).toBeInTheDocument()
      expect(screen.getByText(/5000/)).toBeInTheDocument()
      expect(screen.getByText(/requests remaining/i)).toBeInTheDocument()
    })

    it('shows logout button when onLogoutClick provided', () => {
      render(
        <RateLimitBanner
          remaining={250}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={false}
          onLogoutClick={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
    })

    it('calls onLogoutClick when sign out button clicked', () => {
      const handleLogout = vi.fn()
      render(
        <RateLimitBanner
          remaining={250}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={false}
          onLogoutClick={handleLogout}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
      expect(handleLogout).toHaveBeenCalledTimes(1)
    })

    it('shows personal rate limit message in auth mode', () => {
      render(
        <RateLimitBanner
          remaining={250}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={false}
          onLogoutClick={vi.fn()}
        />
      )

      expect(screen.getByText(/using your personal GitHub rate limit/i)).toBeInTheDocument()
    })

    it('does not show sign in button in auth mode', () => {
      render(
        <RateLimitBanner
          remaining={250}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={false}
          onLogoutClick={vi.fn()}
        />
      )

      expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument()
    })

    it('displays critical state in auth mode when < 5%', () => {
      render(
        <RateLimitBanner
          remaining={50}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={false}
          onLogoutClick={vi.fn()}
        />
      )

      expect(screen.getByText(/Authenticated/i)).toBeInTheDocument()
      // Check for percentage which is unique
      expect(screen.getByText(/1\.0% left/i)).toBeInTheDocument()
      expect(screen.getByText(/5000/)).toBeInTheDocument()
      expect(screen.getByText(/requests remaining/i)).toBeInTheDocument()
    })
  })

  describe('Common Behavior', () => {
    it('calculates percentage correctly', () => {
      render(
        <RateLimitBanner
          remaining={450}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
        />
      )

      expect(screen.getByText(/9\.0% left/i)).toBeInTheDocument()
    })

    it('handles exactly 10% remaining (banner hidden)', () => {
      const { container } = render(
        <RateLimitBanner
          remaining={500}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
        />
      )

      // At exactly 10%, banner should be hidden (logic: >= 10% = hide)
      expect(container).toBeEmptyDOMElement()
    })

    it('handles exactly 5% remaining', () => {
      render(
        <RateLimitBanner
          remaining={250}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
        />
      )

      expect(screen.getByText(/5\.0% left/i)).toBeInTheDocument()
    })

    it('handles zero remaining', () => {
      render(
        <RateLimitBanner
          remaining={0}
          limit={5000}
          reset={oneHourFromNow}
          isDemo={true}
        />
      )

      // Check that warning is shown for zero remaining
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/5000/)).toBeInTheDocument()
      expect(screen.getByText(/requests remaining/i)).toBeInTheDocument()
      expect(screen.getByText(/0\.0% left/i)).toBeInTheDocument()
    })
  })
})
