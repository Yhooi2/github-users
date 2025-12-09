/**
 * AI Analytics types for intelligent insights and recommendations
 * Provides type definitions for AI-powered analysis of GitHub profiles
 */

/**
 * AI insight category types
 */
export type AIInsightCategory =
  | "strength"
  | "weakness"
  | "opportunity"
  | "trend"
  | "recommendation";

/**
 * Priority level for AI insights
 */
export type AIInsightPriority = "high" | "medium" | "low";

/**
 * Single AI-generated insight
 */
export type AIInsight = {
  /** Unique identifier */
  id: string;
  /** Insight category */
  category: AIInsightCategory;
  /** Priority level */
  priority: AIInsightPriority;
  /** Insight title */
  title: string;
  /** Detailed description */
  description: string;
  /** Optional metric score (0-100) */
  score?: number;
  /** Related metrics */
  relatedMetrics?: Array<
    "activity" | "impact" | "quality" | "growth" | "authenticity"
  >;
  /** Actionable recommendations */
  actions?: string[];
};

/**
 * AI analysis summary for a GitHub profile
 */
export type AIAnalysisSummary = {
  /** Overall AI-generated summary */
  summary: string;
  /** Key insights (top 3-5) */
  insights: AIInsight[];
  /** Developer archetype classification */
  archetype: DeveloperArchetype;
  /** Confidence score (0-100) */
  confidence: number;
  /** Analysis timestamp */
  analyzedAt: string;
};

/**
 * Developer archetype classifications
 */
export type DeveloperArchetype = {
  /** Primary archetype */
  primary: DeveloperArchetypeType;
  /** Secondary archetype (if applicable) */
  secondary?: DeveloperArchetypeType;
  /** Confidence in classification (0-100) */
  confidence: number;
  /** Archetype description */
  description: string;
  /** Typical strengths */
  strengths: string[];
  /** Growth areas */
  growthAreas: string[];
};

/**
 * Predefined developer archetype types
 */
export type DeveloperArchetypeType =
  | "full-stack-engineer"
  | "frontend-specialist"
  | "backend-specialist"
  | "devops-engineer"
  | "data-scientist"
  | "mobile-developer"
  | "open-source-contributor"
  | "technical-leader"
  | "emerging-developer"
  | "polyglot-programmer"
  | "domain-specialist";

/**
 * AI recommendation with actionable steps
 */
export type AIRecommendation = {
  /** Recommendation ID */
  id: string;
  /** Recommendation title */
  title: string;
  /** Detailed description */
  description: string;
  /** Target metric to improve */
  targetMetric: "activity" | "impact" | "quality" | "growth" | "authenticity";
  /** Expected impact (0-100) */
  expectedImpact: number;
  /** Estimated effort level */
  effort: "low" | "medium" | "high";
  /** Specific action steps */
  steps: string[];
  /** Related resources */
  resources?: Array<{
    title: string;
    url: string;
    type: "article" | "documentation" | "tutorial" | "tool";
  }>;
};

/**
 * AI Analytics state for React hooks
 */
export type AIAnalyticsState = {
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Analysis summary */
  summary: AIAnalysisSummary | null;
  /** Detailed recommendations */
  recommendations: AIRecommendation[];
  /** Analysis metadata */
  metadata: {
    version: string;
    model: string;
    processingTime?: number;
  };
};

/**
 * AI Analytics API response
 */
export type AIAnalyticsResponse = {
  success: boolean;
  data?: {
    summary: AIAnalysisSummary;
    recommendations: AIRecommendation[];
  };
  error?: {
    code: string;
    message: string;
  };
  metadata: {
    version: string;
    model: string;
    processingTime: number;
  };
};
