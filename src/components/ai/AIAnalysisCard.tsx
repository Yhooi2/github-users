/**
 * AIAnalysisCard - Displays AI analysis summary
 *
 * Uses CardGlass for layout and InsightCardGlass for insights.
 * Stage 7: AI Integration
 */

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEVELOPER_ARCHETYPES } from "@/lib/ai-analytics-constants";
import type { AIAnalysisSummary } from "@/types/ai-analytics";

export type AIAnalysisCardProps = {
  /** AI analysis summary data */
  analysis: AIAnalysisSummary;
  /** Optional custom title */
  title?: string;
};

/**
 * AIAnalysisCard - Displays AI analysis summary with archetype and features
 *
 * @example
 * ```tsx
 * <AIAnalysisCard
 *   analysis={{
 *     summary: "User shows high engagement",
 *     archetype: {
 *       primary: "full-stack-engineer",
 *       confidence: 85,
 *       description: "Balanced expertise",
 *       strengths: ["TypeScript", "React"],
 *       growthAreas: ["CI/CD"]
 *     },
 *     insights: [...],
 *     confidence: 85,
 *     analyzedAt: "2024-01-01"
 *   }}
 * />
 * ```
 */
export function AIAnalysisCard({
  analysis,
  title = "AI Analysis",
}: AIAnalysisCardProps) {
  const archetypeMeta = DEVELOPER_ARCHETYPES[analysis.archetype.primary];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span aria-hidden="true">{archetypeMeta.icon}</span>
            {title}
          </CardTitle>
          <Badge variant="secondary">{analysis.confidence}% confidence</Badge>
        </div>
        <CardDescription>{archetypeMeta.label}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{analysis.summary}</p>

        {analysis.archetype.strengths.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Strengths
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {analysis.archetype.strengths.map((strength) => (
                <Badge key={strength} variant="outline">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {analysis.archetype.growthAreas.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Growth Areas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {analysis.archetype.growthAreas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
