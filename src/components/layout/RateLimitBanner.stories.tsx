import type { Meta, StoryObj } from '@storybook/react-vite'
import { RateLimitBanner } from './RateLimitBanner'

const meta: Meta<typeof RateLimitBanner> = {
  title: 'Layout/RateLimitBanner',
  component: RateLimitBanner,
  tags: ['autodocs'],
  argTypes: {
    onAuthClick: { action: 'auth clicked' },
  },
}

export default meta
type Story = StoryObj<typeof RateLimitBanner>

const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600

export const WarningState: Story = {
  args: {
    remaining: 450,
    limit: 5000,
    reset: oneHourFromNow,
    onAuthClick: () => console.log('Auth clicked'),
  },
}

export const CriticalState: Story = {
  args: {
    remaining: 100,
    limit: 5000,
    reset: oneHourFromNow,
    onAuthClick: () => console.log('Auth clicked'),
  },
}

export const Hidden: Story = {
  args: {
    remaining: 4500,
    limit: 5000,
    reset: oneHourFromNow,
  },
}

export const WithoutAuthButton: Story = {
  args: {
    remaining: 450,
    limit: 5000,
    reset: oneHourFromNow,
  },
}

export const ResetInFewMinutes: Story = {
  args: {
    remaining: 200,
    limit: 5000,
    reset: Math.floor(Date.now() / 1000) + 300, // 5 minutes
    onAuthClick: () => console.log('Auth clicked'),
  },
}
