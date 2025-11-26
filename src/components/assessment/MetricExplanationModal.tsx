import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useResponsive } from "@/hooks";

export interface MetricExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric:
    | "activity"
    | "impact"
    | "quality"
    | "growth"
    | "authenticity"
    | "consistency"
    | "collaboration";
  score: number;
  breakdown: Record<string, number>;
}

interface ExplanationConfig {
  title: string;
  description: string;
  components: Record<string, string>;
}

const EXPLANATIONS: Record<string, ExplanationConfig> = {
  activity: {
    title: "Activity Score",
    description:
      "Measures recent coding activity, consistency, and project diversity",
    components: {
      recentCommits: "Commits in last 3 months (0-40 pts)",
      consistency: "Active months in last year (0-30 pts)",
      diversity: "Number of unique repositories (0-30 pts)",
    },
  },
  impact: {
    title: "Impact Score",
    description: "Measures community reach and engagement",
    components: {
      stars: "Total stars across repos (0-35 pts)",
      forks: "Total forks (0-20 pts)",
      contributors: "Contributors attracted (0-15 pts)",
      reach: "Watchers + dependents (0-20 pts)",
      engagement: "Issue/PR activity (0-10 pts)",
    },
  },
  quality: {
    title: "Quality Score",
    description: "Evaluates code quality, documentation, and maturity",
    components: {
      originality: "Non-forked repositories (0-30 pts)",
      documentation: "README and docs quality (0-25 pts)",
      ownership: "Code ownership ratio (0-20 pts)",
      maturity: "Project age and stability (0-15 pts)",
      stack: "Technology stack diversity (0-10 pts)",
    },
  },
  growth: {
    title: "Growth Score",
    description: "Tracks year-over-year improvement in contributions",
    components: {
      commitGrowth: "Commit volume increase (0-40 pts)",
      repoGrowth: "New repositories created (0-30 pts)",
      impactGrowth: "Stars/forks growth (0-30 pts)",
    },
  },
  authenticity: {
    title: "Authenticity Score",
    description:
      "Analyzes repository originality, activity patterns, and code ownership",
    components: {
      originalityScore: "Non-forked original work (0-25 pts)",
      activityScore: "Consistent activity patterns (0-25 pts)",
      engagementScore: "Community engagement (0-25 pts)",
      codeOwnershipScore: "Code ownership ratio (0-25 pts)",
    },
  },
  consistency: {
    title: "Consistency Score",
    description:
      "Measures regularity and stability of coding activity over time. Higher scores indicate steady, predictable contribution patterns.",
    components: {
      regularity: "Commit distribution evenness (0-50 pts)",
      streak: "Consecutive active years (0-30 pts)",
      recency: "Recent activity in last 2 years (0-20 pts)",
    },
  },
  collaboration: {
    title: "Collaboration Score",
    description:
      "Evaluates contributions to other developers' projects. Shows how much you work with the broader open source community.",
    components: {
      contributionRatio: "Contributions to others' repos (0-50 pts)",
      diversity: "Number of external projects (0-30 pts)",
      engagement: "Quality of contributions (0-20 pts)",
    },
  },
};

/**
 * Metric explanation modal with responsive behavior
 *
 * - Desktop: Dialog (centered modal)
 * - Mobile: Sheet (bottom drawer, full width)
 */
export function MetricExplanationModal({
  isOpen,
  onClose,
  metric,
  score,
  breakdown,
}: MetricExplanationModalProps) {
  const { isMobile } = useResponsive();
  const explanation = EXPLANATIONS[metric];

  if (!explanation) {
    return null;
  }

  const content = (
    <div className="space-y-3">
      <h4 className="font-medium">Score Breakdown:</h4>
      {Object.entries(breakdown).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="text-sm text-muted-foreground">
            {explanation.components[key] || key}
          </span>
          <span className="font-medium">{value} pts</span>
        </div>
      ))}
    </div>
  );

  // Mobile: Sheet from bottom (full width)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>
              {explanation.title}: {score}%
            </SheetTitle>
            <SheetDescription>{explanation.description}</SheetDescription>
          </SheetHeader>
          <div className="mt-4">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {explanation.title}: {score}%
          </DialogTitle>
          <DialogDescription>{explanation.description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
