import { useCallback, useEffect, useState } from "react";
import { AnimatedBackground } from "shadcn-glass-ui";
import type { Repository } from "./apollo/github-api.types";
import { MetricAssessmentGrid } from "./components/assessment/MetricAssessmentGrid";
import { AuthRequiredModal } from "./components/auth/AuthRequiredModal";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { RateLimitBanner } from "./components/layout/RateLimitBanner";
import { SearchHeader } from "./components/layout/SearchHeader";
import { ActivityTimelineV2 } from "./components/timeline/ActivityTimelineV2";
import { TooltipProvider } from "./components/ui/tooltip";
import UserProfile from "./components/UserProfile";
import { useAuthenticityScore, useUserAnalytics } from "./hooks";
import { calculateActivityScore } from "./lib/metrics/activity";
import { calculateCollaborationScore } from "./lib/metrics/collaboration";
import { calculateConsistencyScore } from "./lib/metrics/consistency";
import { calculateImpactScore } from "./lib/metrics/impact";
import { calculateQualityScore } from "./lib/metrics/quality";
import { calculateLanguageStatistics } from "./lib/statistics";

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
  const [userName, setUserName] = useState("Yhooi2");

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
    const authStatus = params.get("auth");
    const errorParam = params.get("error");

    if (authStatus === "success") {
      // TODO: Add success toast notification
      console.warn("✅ Authentication successful!");
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    } else if (authStatus === "logged_out") {
      // TODO: Add info toast notification
      console.warn("ℹ️ Logged out successfully");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (errorParam) {
      // TODO: Add error toast notification
      console.error("❌ Authentication error:", errorParam);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Handle rate limit updates from GraphQL responses
  const handleRateLimitUpdate = useCallback(
    (newRateLimit: {
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
    },
    [],
  );

  // Calculate metrics from timeline data
  const baseMetrics =
    timeline.length > 0
      ? {
          activity: calculateActivityScore(timeline),
          impact: calculateImpactScore(timeline),
          quality: calculateQualityScore(timeline),
          consistency: calculateConsistencyScore(timeline),
          collaboration: calculateCollaborationScore(timeline),
        }
      : null;

  // Extract and categorize repositories from timeline
  const allRepositories = timeline.flatMap((year) => [
    ...year.ownedRepos.map((repo) => repo.repository),
    ...year.contributions.map((repo) => repo.repository),
  ]) as Repository[];

  // Calculate language statistics for skills display
  const languageStats = calculateLanguageStatistics(allRepositories);
  const languages = languageStats.map((lang) => ({
    name: lang.name,
    percent: lang.percentage,
  }));

  // Calculate authenticity score from all repositories
  const authenticityData = useAuthenticityScore(allRepositories);

  // Combine metrics with authenticity
  const metrics = baseMetrics
    ? {
        ...baseMetrics,
        authenticity: {
          score: allRepositories.length > 0 ? authenticityData.score : 0,
          level:
            allRepositories.length > 0
              ? (authenticityData.category as
                  | "High"
                  | "Medium"
                  | "Low"
                  | "Suspicious")
              : ("Low" as const),
        },
      }
    : null;

  // OAuth handler - redirect to backend OAuth endpoint
  const handleGitHubAuth = () => {
    window.location.href = "/api/auth/login";
  };

  // Logout handler - redirect to backend logout endpoint
  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  // Determine authentication status
  const isAuthenticated = !rateLimit.isDemo && !!rateLimit.userLogin;

  // Handler for AI generation button
  const handleAIGenerate = useCallback(() => {
    // TODO: Implement AI analysis generation
    // Placeholder for future AI integration
  }, [userName]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto space-y-8 p-4 pb-16">
          {/* Compact Header - Brand, Search, Theme, User */}
          <SearchHeader
            userName={userName}
            onSearch={setUserName}
            userMenuProps={{
              isAuthenticated,
              user: isAuthenticated
                ? {
                    login: rateLimit.userLogin!,
                    avatarUrl: `https://github.com/${rateLimit.userLogin}.png`,
                  }
                : undefined,
              onSignIn: () => setShowAuthModal(true),
              onSignOut: handleLogout,
            }}
          />

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
              className="rounded-lg border border-destructive p-4 text-destructive"
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
              <UserProfile
                userName={userName}
                onRateLimitUpdate={handleRateLimitUpdate}
                languages={languages}
                onAIGenerate={handleAIGenerate}
              />

              {/* Metric Assessment Grid - 6 Metrics */}
              {metrics && (
                <MetricAssessmentGrid metrics={metrics} loading={loading} />
              )}

              {/* Activity Timeline - Year by Year (V2 with 3-level disclosure) */}
              <ActivityTimelineV2
                timeline={timeline}
                loading={loading}
                username={userName}
              />
            </ErrorBoundary>
          )}

          {/* Loading State - Show UserProfile for loading indication */}
          {userName && loading && !profile && (
            <UserProfile
              userName={userName}
              onRateLimitUpdate={handleRateLimitUpdate}
              languages={languages}
            />
          )}

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
    </TooltipProvider>
  );
}

export default App;
