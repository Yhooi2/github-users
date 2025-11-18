import type { Meta, StoryObj } from '@storybook/react-vite'
import { RateLimitBanner } from './RateLimitBanner'

const meta: Meta<typeof RateLimitBanner> = {
  title: 'Layout/RateLimitBanner',
  component: RateLimitBanner,
  tags: ['autodocs'],
  argTypes: {
    onAuthClick: { action: 'auth clicked' },
    onLogoutClick: { action: 'logout clicked' },
  },
}

export default meta
type Story = StoryObj<typeof RateLimitBanner>

const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600

// Demo Mode Stories
export const DemoWarningState: Story = {
  args: {
    remaining: 450,
    limit: 5000,
    reset: oneHourFromNow,
    isDemo: true,
    onAuthClick: () => console.log('Auth clicked'),
  },
}

export const DemoCriticalState: Story = {
  args: {
    remaining: 100,
    limit: 5000,
    reset: oneHourFromNow,
    isDemo: true,
    onAuthClick: () => console.log('Auth clicked'),
  },
}

export const DemoHidden: Story = {
  args: {
    remaining: 4500,
    limit: 5000,
    reset: oneHourFromNow,
    isDemo: true,
  },
}

export const DemoWithoutAuthButton: Story = {
  args: {
    remaining: 450,
    limit: 5000,
    reset: oneHourFromNow,
    isDemo: true,
  },
}

export const DemoResetInFewMinutes: Story = {
  args: {
    remaining: 200,
    limit: 5000,
    reset: Math.floor(Date.now() / 1000) + 300, // 5 minutes
    isDemo: true,
    onAuthClick: () => console.log('Auth clicked'),
  },
}

// Authenticated Mode Stories
export const AuthLowLimit: Story = {
  args: {
    remaining: 250,
    limit: 5000,
    reset: oneHourFromNow,
    isDemo: false,
    onLogoutClick: () => console.log('Logout clicked'),
  },
}

export const AuthCritical: Story = {
  args: {
    remaining: 50,
    limit: 5000,
    reset: oneHourFromNow,
    isDemo: false,
    onLogoutClick: () => console.log('Logout clicked'),
  },
}

export const AuthHidden: Story = {
  args: {
    remaining: 4500,
    limit: 5000,
    reset: oneHourFromNow,
    isDemo: false,
    onLogoutClick: () => console.log('Logout clicked'),
  },
}

// Backward compatibility (old names for demo mode)
export const WarningState: Story = DemoWarningState
export const CriticalState: Story = DemoCriticalState
export const Hidden: Story = DemoHidden
export const WithoutAuthButton: Story = DemoWithoutAuthButton
export const ResetInFewMinutes: Story = DemoResetInFewMinutes
