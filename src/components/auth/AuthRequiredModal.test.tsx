import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthRequiredModal } from './AuthRequiredModal'

describe('AuthRequiredModal', () => {
  it('renders when open is true', () => {
    render(
      <AuthRequiredModal
        open={true}
        onOpenChange={() => {}}
        onGitHubAuth={() => {}}
        remaining={0}
        limit={5000}
      />
    )

    expect(screen.getByText(/Demo limit reached/i)).toBeInTheDocument()
    expect(screen.getByText(/5,000 requests\/hour/i)).toBeInTheDocument()
  })

  it('calls onGitHubAuth when auth button clicked', () => {
    const handleAuth = vi.fn()
    render(
      <AuthRequiredModal
        open={true}
        onOpenChange={() => {}}
        onGitHubAuth={handleAuth}
        remaining={0}
        limit={5000}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))
    expect(handleAuth).toHaveBeenCalledTimes(1)
  })

  it('displays used requests correctly', () => {
    render(
      <AuthRequiredModal
        open={true}
        onOpenChange={() => {}}
        onGitHubAuth={() => {}}
        remaining={100}
        limit={5000}
      />
    )

    expect(screen.getByText(/used 4900 of 5000 demo requests/i)).toBeInTheDocument()
  })

  it('shows privacy note', () => {
    render(
      <AuthRequiredModal
        open={true}
        onOpenChange={() => {}}
        onGitHubAuth={() => {}}
        remaining={0}
        limit={5000}
      />
    )

    expect(screen.getByText(/never post on your behalf/i)).toBeInTheDocument()
  })
})
