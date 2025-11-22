import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLanguageColor } from "@/lib/constants";
import type { ProjectForModal } from "../ProjectAnalyticsModal";

export interface CodeTabProps {
  project: ProjectForModal;
}

interface LanguageBreakdown {
  lang: string;
  percent: number;
  lines: number;
}

// Placeholder data
const LANGUAGES: LanguageBreakdown[] = [
  { lang: "TypeScript", percent: 68, lines: 45230 },
  { lang: "JavaScript", percent: 15, lines: 9980 },
  { lang: "CSS", percent: 10, lines: 6650 },
  { lang: "HTML", percent: 5, lines: 3325 },
  { lang: "Shell", percent: 2, lines: 1330 },
];

interface CodeMetric {
  label: string;
  value: string;
}

const CODE_METRICS: CodeMetric[] = [
  { label: "Total Lines", value: "66,515" },
  { label: "Files Changed", value: "342" },
  { label: "Additions", value: "+12,450" },
  { label: "Deletions", value: "-3,210" },
];

/**
 * Code tab content for project analytics modal
 *
 * Shows:
 * - Language breakdown with percentages
 * - Code metrics (lines, files, additions/deletions)
 */
export function CodeTab({ project: _project }: CodeTabProps) {
  return (
    <div className="space-y-6">
      {/* Language breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Language Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stacked bar */}
          <div className="mb-4 flex h-4 overflow-hidden rounded-full">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.lang}
                className="transition-all"
                style={{
                  width: `${lang.percent}%`,
                  backgroundColor: getLanguageColor(lang.lang),
                }}
                title={`${lang.lang}: ${lang.percent}%`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {LANGUAGES.map((lang) => (
              <div key={lang.lang} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: getLanguageColor(lang.lang) }}
                />
                <span className="min-w-0 flex-1 text-sm">{lang.lang}</span>
                <div className="w-24">
                  <Progress value={lang.percent} className="h-1.5" />
                </div>
                <span className="w-12 text-right text-sm text-muted-foreground">
                  {lang.percent}%
                </span>
                <span className="w-20 text-right text-xs text-muted-foreground">
                  {lang.lines.toLocaleString()} lines
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Code Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {CODE_METRICS.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* File types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Most Changed Files</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            List of most frequently modified files would be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
