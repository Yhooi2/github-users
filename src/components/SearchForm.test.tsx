import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SearchForm from './SearchForm'
import { toast } from 'sonner'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('SearchForm', () => {
  const mockSetUserName = vi.fn()
  const defaultProps = {
    userName: '',
    setUserName: mockSetUserName,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input and button', () => {
    render(<SearchForm {...defaultProps} />)

    expect(screen.getByPlaceholderText(/Search GitHub User/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('renders with initial username value', () => {
    render(<SearchForm userName="octocat" setUserName={mockSetUserName} />)

    const input = screen.getByPlaceholderText(/Search GitHub User/i) as HTMLInputElement
    expect(input.value).toBe('octocat')
  })

  it('updates input value when typing', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const input = screen.getByPlaceholderText(/Search GitHub User/i)
    await user.type(input, 'testuser')

    expect(input).toHaveValue('testuser')
  })

  it('calls setUserName with username on submit', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const input = screen.getByPlaceholderText(/Search GitHub User/i)
    const button = screen.getByRole('button', { name: /search/i })

    await user.type(input, 'octocat')
    await user.click(button)

    expect(mockSetUserName).toHaveBeenCalledWith('octocat')
    expect(mockSetUserName).toHaveBeenCalledTimes(1)
  })

  it('submits form when pressing Enter', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const input = screen.getByPlaceholderText(/Search GitHub User/i)

    await user.type(input, 'torvalds{Enter}')

    expect(mockSetUserName).toHaveBeenCalledWith('torvalds')
  })

  it('shows error toast when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const button = screen.getByRole('button', { name: /search/i })
    await user.click(button)

    expect(toast.error).toHaveBeenCalledWith('Please enter a valid username')
    expect(mockSetUserName).not.toHaveBeenCalled()
  })

  it('shows error toast when submitting whitespace-only input', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const input = screen.getByPlaceholderText(/Search GitHub User/i)
    const button = screen.getByRole('button', { name: /search/i })

    // Type spaces and then clear (empty state)
    await user.type(input, '   ')
    await user.clear(input)
    await user.click(button)

    expect(toast.error).toHaveBeenCalled()
    expect(mockSetUserName).not.toHaveBeenCalled()
  })

  it('trims input and searches when valid', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const input = screen.getByPlaceholderText(/Search GitHub User/i)
    const button = screen.getByRole('button', { name: /search/i })

    await user.type(input, '  octocat  ')
    await user.click(button)

    // Component now trims whitespace before submitting
    expect(mockSetUserName).toHaveBeenCalledWith('octocat')
  })

  it('has accessible label for screen readers', () => {
    render(<SearchForm {...defaultProps} />)

    const label = screen.getByLabelText(/search/i)
    expect(label).toBeInTheDocument()
  })
})
