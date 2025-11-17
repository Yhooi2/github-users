import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RateLimitBanner } from './RateLimitBanner'

describe('RateLimitBanner', () => {
  const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600

  it('does not render when remaining > 10%', () => {
    const { container } = render(
      <RateLimitBanner remaining={4500} limit={5000} reset={oneHourFromNow} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders warning state when remaining < 10%', () => {
    render(
      <RateLimitBanner remaining={450} limit={5000} reset={oneHourFromNow} />
    )
    expect(screen.getByText(/Demo mode active/i)).toBeInTheDocument()
    expect(screen.getByText(/450 of 5000 requests remaining/i)).toBeInTheDocument()
  })

  it('renders critical state when remaining < 5%', () => {
    render(
      <RateLimitBanner remaining={100} limit={5000} reset={oneHourFromNow} />
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
        onAuthClick={handleAuth}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /sign in with github/i }))
    expect(handleAuth).toHaveBeenCalledTimes(1)
  })

  it('displays time until reset', () => {
    render(
      <RateLimitBanner remaining={450} limit={5000} reset={oneHourFromNow} />
    )
    expect(screen.getByText(/Resets in \d+ minutes/i)).toBeInTheDocument()
  })
})
