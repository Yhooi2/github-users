import { useState } from 'react';
import { SearchHeader } from './components/layout/SearchHeader';
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

function App() {
  const [userName, setUserName] = useState('');
  const [rateLimit] = useState({ remaining: 5000, limit: 5000, reset: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch user analytics data
  const { profile, timeline, loading, error } = useUserAnalytics(userName);

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

  const handleGitHubAuth = () => {
    // TODO: Implement OAuth flow in Phase 7
    console.log('GitHub OAuth not yet implemented');
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto space-y-8 p-4 pb-16">
        {/* Search Header with Theme Toggle */}
        <SearchHeader userName={userName} onSearch={setUserName} />

        {/* Rate Limit Banner */}
        <RateLimitBanner
          remaining={rateLimit.remaining}
          limit={rateLimit.limit}
          reset={rateLimit.reset}
          onAuthClick={() => setShowAuthModal(true)}
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
            <UserProfile userName={userName} />

            {/* Quick Assessment - 4 Key Metrics */}
            {metrics && <QuickAssessment metrics={metrics} loading={loading} />}

            {/* Activity Timeline - Year by Year */}
            <ActivityTimeline timeline={timeline} loading={loading} />

            {/* Project Section - Owned vs Contributions */}
            <ProjectSection projects={projects} loading={loading} />
          </ErrorBoundary>
        )}

        {/* Loading State - Show UserProfile for loading indication */}
        {userName && loading && !profile && <UserProfile userName={userName} />}

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
