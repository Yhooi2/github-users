import { useState, useEffect } from 'react';
import { SearchHeader } from './components/layout/SearchHeader';
import { UserMenu } from './components/layout/UserMenu';
import { useUserAnalytics } from './hooks/useUserAnalytics';
import { RateLimitBanner } from './components/layout/RateLimitBanner';
import { AuthRequiredModal } from './components/auth/AuthRequiredModal';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import UserProfile from './components/UserProfile';
import { QuickAssessment } from './components/assessment/QuickAssessment';
import { ActivityTimeline } from './components/timeline/ActivityTimeline';
import { ProjectSection } from './components/projects/ProjectSection';
import { calculateActivityScore } from './lib/metrics/activity';
import { calculateImpactScore } from './lib/metrics/impact';
import { calculateQualityScore } from './lib/metrics/quality';
import { calculateGrowthScore } from './lib/metrics/growth';
import type { Repository } from './apollo/github-api.types';

/**
 * Rate limit state interface
 */
interface RateLimitState {
  remaining: number;
  limit: number;
  reset: number;
  isDemo: boolean;
  userLogin?: string;
}

function App() {
  const [userName, setUserName] = useState('');

  // Rate limit state (updated from GraphQL responses)
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    remaining: 5000,
    limit: 5000,
    reset: 0,
    isDemo: true,
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch user analytics data
  const { profile, timeline, loading, error } = useUserAnalytics(userName);

  // Handle URL parameters after OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('auth');
    const errorParam = params.get('error');

    if (authStatus === 'success') {
      // TODO: Add success toast notification
      console.log('✅ Authentication successful!');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (authStatus === 'logged_out') {
      // TODO: Add info toast notification
      console.log('ℹ️ Logged out successfully');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (errorParam) {
      // TODO: Add error toast notification
      console.error('❌ Authentication error:', errorParam);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Handle rate limit updates from GraphQL responses
  const handleRateLimitUpdate = (newRateLimit: {
    remaining: number;
    limit: number;
    reset: number;
    used: number;
    isDemo: boolean;
    userLogin?: string;
  }) => {
    setRateLimit({
      remaining: newRateLimit.remaining,
      limit: newRateLimit.limit,
      reset: newRateLimit.reset,
      isDemo: newRateLimit.isDemo,
      userLogin: newRateLimit.userLogin,
    });
  };

  // Calculate metrics from timeline data
  const metrics =
    timeline.length > 0
      ? {
          activity: calculateActivityScore(timeline),
          impact: calculateImpactScore(timeline),
          quality: calculateQualityScore(timeline),
          growth: calculateGrowthScore(timeline),
        }
      : null;

  // Extract and categorize repositories from timeline
  const projects = {
    owned: timeline.flatMap((year) =>
      year.ownedRepos.map((repo) => repo.repository)
    ) as Repository[],
    contributions: timeline.flatMap((year) =>
      year.contributions.map((repo) => repo.repository)
    ) as Repository[],
  };

  // OAuth handler - redirect to backend OAuth endpoint
  const handleGitHubAuth = () => {
    window.location.href = '/api/auth/login';
  };

  // Logout handler - redirect to backend logout endpoint
  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  // Determine authentication status
  const isAuthenticated = !rateLimit.isDemo && !!rateLimit.userLogin;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto space-y-8 p-4 pb-16">
        {/* Header with Search and User Menu */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <SearchHeader userName={userName} onSearch={setUserName} />
          </div>

          {/* User Menu - Sign in / Avatar */}
          <div className="flex-shrink-0 pt-2">
            <UserMenu
              isAuthenticated={isAuthenticated}
              user={
                isAuthenticated
                  ? {
                      login: rateLimit.userLogin!,
                      avatarUrl: `https://github.com/${rateLimit.userLogin}.png`,
                    }
                  : undefined
              }
              onSignIn={() => setShowAuthModal(true)}
              onSignOut={handleLogout}
            />
          </div>
        </div>

        {/* Rate Limit Banner */}
        <RateLimitBanner
          remaining={rateLimit.remaining}
          limit={rateLimit.limit}
          reset={rateLimit.reset}
          isDemo={rateLimit.isDemo}
          onAuthClick={() => setShowAuthModal(true)}
          onLogoutClick={handleLogout}
        />

        {/* Error Display */}
        {error && (
          <div
            className="border-destructive text-destructive rounded-lg border p-4"
            role="alert"
            aria-live="assertive"
          >
            Error: {error.message}
          </div>
        )}

        {/* Main Content - Single Page Layout */}
        {userName && profile && !error && (
          <ErrorBoundary>
            {/* User Profile Section */}
            <UserProfile userName={userName} onRateLimitUpdate={handleRateLimitUpdate} />

            {/* Quick Assessment - 4 Key Metrics */}
            {metrics && <QuickAssessment metrics={metrics} loading={loading} />}

            {/* Activity Timeline - Year by Year */}
            <ActivityTimeline timeline={timeline} loading={loading} />

            {/* Project Section - Owned vs Contributions */}
            <ProjectSection projects={projects} loading={loading} />
          </ErrorBoundary>
        )}

        {/* Loading State - Show UserProfile for loading indication */}
        {userName && loading && !profile && <UserProfile userName={userName} onRateLimitUpdate={handleRateLimitUpdate} />}

        {/* Auth Required Modal */}
        <AuthRequiredModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
          onGitHubAuth={handleGitHubAuth}
          remaining={rateLimit.remaining}
          limit={rateLimit.limit}
        />
      </div>
    </div>
  );
}

export default App;
