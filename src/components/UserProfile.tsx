import useQueryUser from "@/apollo/useQueryUser"
import { getYearLabels } from "@/apollo/date-helpers"
import { Button } from "@/components/ui/button"


type Props = {
    userName: string
}

/**
 * User profile component that displays comprehensive GitHub user information
 *
 * Fetches and displays user data from GitHub GraphQL API using Apollo Client.
 * Handles loading, error, and not-found states automatically.
 *
 * Displays:
 * - Avatar image
 * - Name, username, and bio
 * - Location
 * - Follower/following/gist counts
 * - 3-year contribution history
 * - Account creation date
 * - Repository count
 *
 * @param props - Component props
 * @param props.userName - GitHub username to fetch and display
 * @returns User profile component with loading/error/data states
 *
 * @example
 * ```typescript
 * function App() {
 *   const [userName, setUserName] = useState('octocat')
 *
 *   return <UserProfile userName={userName} />
 * }
 * ```
 */
function UserProfile({ userName } : Props) {
    const {data, loading, error, refetch} = useQueryUser(userName)
    const yearLabels = getYearLabels()

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground text-lg">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 p-8">
                <p className="text-destructive">{error?.message}</p>
                <Button onClick={() => refetch()}>
                    Retry
                </Button>
            </div>
        )
    }

    if (!data || !data.user) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">User Not Found.</p>
            </div>
        )
    }

    const user = data.user
    const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
            {/* Header Section */}
            <div className="flex flex-col items-start gap-6 md:flex-row">
                {/* Avatar */}
                <img
                    src={user.avatarUrl}
                    alt={`${user.name || user.login}'s avatar`}
                    className="border-border h-32 w-32 rounded-full border-4"
                />

                {/* User Info */}
                <div className="flex-1 space-y-2">
                    <h1 className="text-3xl font-bold">{user.name || user.login}</h1>
                    <p className="text-muted-foreground text-xl">@{user.login}</p>
                    {user.bio && <p className="text-base">{user.bio}</p>}
                    {user.location && (
                        <p className="text-muted-foreground flex items-center gap-2 text-sm">
                            <span>📍</span> {user.location}
                        </p>
                    )}
                    <p className="text-muted-foreground text-sm">
                        Joined {joinedDate}
                    </p>
                    <a
                        href={user.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary inline-block text-sm hover:underline"
                    >
                        View on GitHub →
                    </a>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{user.repositories.totalCount}</div>
                    <div className="text-muted-foreground text-sm">Repositories</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{user.followers.totalCount}</div>
                    <div className="text-muted-foreground text-sm">Followers</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{user.following.totalCount}</div>
                    <div className="text-muted-foreground text-sm">Following</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{user.gists.totalCount}</div>
                    <div className="text-muted-foreground text-sm">Gists</div>
                </div>
            </div>

            {/* Contribution History */}
            <div className="bg-muted/50 space-y-4 rounded-lg p-6">
                <h2 className="text-xl font-semibold">Contribution History</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">{yearLabels.year1}</div>
                        <div className="text-2xl font-bold text-green-600">
                            {user.year1.totalCommitContributions}
                        </div>
                        <div className="text-muted-foreground text-xs">commits</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">{yearLabels.year2}</div>
                        <div className="text-2xl font-bold text-green-600">
                            {user.year2.totalCommitContributions}
                        </div>
                        <div className="text-muted-foreground text-xs">commits</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">{yearLabels.year3}</div>
                        <div className="text-2xl font-bold text-green-600">
                            {user.year3.totalCommitContributions}
                        </div>
                        <div className="text-muted-foreground text-xs">commits</div>
                    </div>
                </div>
            </div>

            {/* Top Repositories */}
            {user.contributionsCollection.commitContributionsByRepository.length > 0 && (
                <div className="bg-muted/50 space-y-4 rounded-lg p-6">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <div className="space-y-2">
                        {user.contributionsCollection.commitContributionsByRepository
                            .slice(0, 5)
                            .map((repo, index) => (
                                <div
                                    key={index}
                                    className="bg-background flex items-center justify-between rounded-md p-3"
                                >
                                    <span className="font-medium">{repo.repository.name}</span>
                                    <span className="text-muted-foreground text-sm">
                                        {repo.contributions.totalCount} commits
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserProfile
