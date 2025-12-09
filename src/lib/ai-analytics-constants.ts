/**
 * AI Analytics constants and configuration
 * Centralized constants for AI-powered insights and recommendations
 */

import type {
  AIInsightCategory,
  AIInsightPriority,
  DeveloperArchetypeType,
} from "@/types/ai-analytics";

/**
 * Developer archetype definitions with metadata
 */
export const DEVELOPER_ARCHETYPES: Record<
  DeveloperArchetypeType,
  {
    label: string;
    description: string;
    icon: string;
  }
> = {
  "full-stack-engineer": {
    label: "Full-Stack Engineer",
    description:
      "Balanced expertise across frontend, backend, and infrastructure",
    icon: "🔧",
  },
  "frontend-specialist": {
    label: "Frontend Specialist",
    description: "Expert in UI/UX, modern frameworks, and user interfaces",
    icon: "🎨",
  },
  "backend-specialist": {
    label: "Backend Specialist",
    description: "Focused on APIs, databases, and server-side logic",
    icon: "⚙️",
  },
  "devops-engineer": {
    label: "DevOps Engineer",
    description:
      "Expertise in CI/CD, infrastructure, and deployment automation",
    icon: "🚀",
  },
  "data-scientist": {
    label: "Data Scientist",
    description: "Specialized in data analysis, ML, and statistical computing",
    icon: "📊",
  },
  "mobile-developer": {
    label: "Mobile Developer",
    description: "Expert in iOS, Android, or cross-platform mobile development",
    icon: "📱",
  },
  "open-source-contributor": {
    label: "Open Source Contributor",
    description: "Active in community projects and collaborative development",
    icon: "🌍",
  },
  "technical-leader": {
    label: "Technical Leader",
    description: "Focus on architecture, mentoring, and technical direction",
    icon: "👑",
  },
  "emerging-developer": {
    label: "Emerging Developer",
    description: "Early career with growing skills and active learning",
    icon: "🌱",
  },
  "polyglot-programmer": {
    label: "Polyglot Programmer",
    description: "Proficient in multiple languages and diverse tech stacks",
    icon: "🗣️",
  },
  "domain-specialist": {
    label: "Domain Specialist",
    description: "Deep expertise in specific domain or industry",
    icon: "🎯",
  },
};

/**
 * AI insight category metadata
 */
export const AI_INSIGHT_CATEGORIES: Record<
  AIInsightCategory,
  {
    label: string;
    description: string;
    icon: string;
  }
> = {
  strength: {
    label: "Strength",
    description: "Areas where the developer excels",
    icon: "💪",
  },
  weakness: {
    label: "Area for Improvement",
    description: "Opportunities to develop skills",
    icon: "🎯",
  },
  opportunity: {
    label: "Opportunity",
    description: "Potential growth areas and new directions",
    icon: "✨",
  },
  trend: {
    label: "Trend",
    description: "Patterns and trajectories in development activity",
    icon: "📈",
  },
  recommendation: {
    label: "Recommendation",
    description: "Actionable suggestions for improvement",
    icon: "💡",
  },
};

/**
 * AI insight priority levels
 */
export const AI_INSIGHT_PRIORITIES: Record<
  AIInsightPriority,
  {
    label: string;
    weight: number;
  }
> = {
  high: {
    label: "High Priority",
    weight: 3,
  },
  medium: {
    label: "Medium Priority",
    weight: 2,
  },
  low: {
    label: "Low Priority",
    weight: 1,
  },
};

/**
 * AI Analytics API configuration
 */
export const AI_ANALYTICS_CONFIG = {
  /** Current API version */
  VERSION: "1.0.0",
  /** AI model identifier */
  MODEL: "claude-3-5-sonnet-20241022",
  /** Maximum insights to return */
  MAX_INSIGHTS: 8,
  /** Maximum recommendations to return */
  MAX_RECOMMENDATIONS: 5,
  /** Minimum confidence threshold (0-100) */
  MIN_CONFIDENCE: 60,
  /** Cache TTL in milliseconds (24 hours) */
  CACHE_TTL: 24 * 60 * 60 * 1000,
} as const;

/**
 * Default AI insight priorities by category
 */
export const DEFAULT_INSIGHT_PRIORITIES: Record<
  AIInsightCategory,
  AIInsightPriority
> = {
  strength: "low",
  weakness: "high",
  opportunity: "medium",
  trend: "low",
  recommendation: "high",
};

/**
 * Effort level labels and estimates
 */
export const EFFORT_LEVELS = {
  low: {
    label: "Low Effort",
    description: "Quick wins, minimal time investment",
    estimatedHours: "1-5 hours",
  },
  medium: {
    label: "Medium Effort",
    description: "Moderate commitment, regular practice",
    estimatedHours: "1-2 weeks",
  },
  high: {
    label: "High Effort",
    description: "Significant investment, long-term commitment",
    estimatedHours: "1+ months",
  },
} as const;

/**
 * Mock data version for development
 */
export const AI_MOCK_DATA_VERSION = "1.0.0-dev";
