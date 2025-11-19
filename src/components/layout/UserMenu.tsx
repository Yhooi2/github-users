import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut } from 'lucide-react'

/**
 * Props for UserMenu component
 */
export interface UserMenuProps {
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean

  /**
   * User information (only when authenticated)
   */
  user?: {
    /** GitHub username */
    login: string
    /** Avatar URL */
    avatarUrl: string
  }

  /**
   * Callback when sign in button is clicked
   */
  onSignIn: () => void

  /**
   * Callback when sign out is clicked
   */
  onSignOut: () => void
}

/**
 * UserMenu Component
 *
 * Displays authentication status and provides login/logout functionality:
 * - Unauthenticated: Shows "Sign in with GitHub" button
 * - Authenticated: Shows user avatar with dropdown menu
 *
 * @example
 * ```tsx
 * <UserMenu
 *   isAuthenticated={false}
 *   onSignIn={() => window.location.href = '/api/auth/login'}
 *   onSignOut={() => window.location.href = '/api/auth/logout'}
 * />
 * ```
 */
export function UserMenu({
  isAuthenticated,
  user,
  onSignIn,
  onSignOut,
}: UserMenuProps) {
  // Unauthenticated state: Show sign in button
  if (!isAuthenticated) {
    return (
      <Button onClick={onSignIn} variant="outline" size="sm">
        <User className="mr-2 h-4 w-4" />
        Sign in with GitHub
      </Button>
    )
  }

  // Authenticated state: Show avatar with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          aria-label="User menu"
        >
          <Avatar>
            <AvatarImage src={user?.avatarUrl} alt={`@${user?.login}`} />
            <AvatarFallback>{user?.login?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">@{user?.login}</p>
            <p className="text-xs leading-none text-muted-foreground">
              Authenticated
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
