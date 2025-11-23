import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReducedMotion, useResponsive, type TabName } from "@/hooks";
import { cn } from "@/lib/utils";
import { BarChart3, Clock, Code2, Download, ExternalLink, Users } from "lucide-react";
import { Suspense, lazy, useCallback } from "react";

// Lazy load tab content
const OverviewTab = lazy(() =>
  import("./tabs/OverviewTab").then((m) => ({ default: m.OverviewTab })),
);
const TimelineTab = lazy(() =>
  import("./tabs/TimelineTab").then((m) => ({ default: m.TimelineTab })),
);
const CodeTab = lazy(() =>
  import("./tabs/CodeTab").then((m) => ({ default: m.CodeTab })),
);
const TeamTab = lazy(() =>
  import("./tabs/TeamTab").then((m) => ({ default: m.TeamTab })),
);

export interface ProjectForModal {
  id: string;
  name: string;
  description?: string;
  url: string;
  stars: number;
  forks: number;
}

export interface ProjectAnalyticsModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onOpenChange: (open: boolean) => void;
  /** Project data */
  project: ProjectForModal | null;
  /** Active tab */
  activeTab: TabName;
  /** Callback when tab changes */
  onTabChange: (tab: TabName) => void;
}

const TAB_CONFIG: { value: TabName; label: string; icon: typeof BarChart3 }[] = [
  { value: "overview", label: "Overview", icon: BarChart3 },
  { value: "timeline", label: "Timeline", icon: Clock },
  { value: "code", label: "Code", icon: Code2 },
  { value: "team", label: "Team", icon: Users },
];

/**
 * Project analytics modal for Level 2 detailed view
 *
 * Renders as Dialog on desktop/tablet and Sheet on mobile.
 * Contains 4 tabs: Overview, Timeline, Code, Team.
 *
 * @example
 * ```tsx
 * const { modalOpen, selectedProjectId, activeTab, closeModal, setActiveTab } = useProgressiveDisclosure();
 *
 * <ProjectAnalyticsModal
 *   open={modalOpen}
 *   onOpenChange={(open) => !open && closeModal()}
 *   project={projects.find(p => p.id === selectedProjectId)}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 * />
 * ```
 */
export function ProjectAnalyticsModal({
  open,
  onOpenChange,
  project,
  activeTab,
  onTabChange,
}: ProjectAnalyticsModalProps) {
  const { isMobile } = useResponsive();
  const prefersReducedMotion = useReducedMotion();

  // Handle PDF export (placeholder - integrate with actual PDF library)
  const handleExportPDF = useCallback(() => {
    // TODO: Integrate with jsPDF or similar library
    // For now, open print dialog as fallback
    window.print();
  }, []);

  if (!project) {
    return null;
  }

  // Footer with action buttons
  const modalFooter = (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <Download className="mr-1.5 h-4 w-4" />
        Export PDF
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-1.5 h-4 w-4" />
          Open on GitHub
        </a>
      </Button>
    </div>
  );

  const modalContent = (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as TabName)}
      className="flex h-full flex-col"
    >
      {/* Horizontal tabs navigation */}
      <TabsList className="grid w-full grid-cols-4">
        {TAB_CONFIG.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} className="gap-1.5">
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className={cn(isMobile && "sr-only")}>{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab content with lazy loading */}
      <div className="mt-4 flex-1 overflow-y-auto">
        <Suspense fallback={<TabLoadingFallback />}>
          <TabsContent value="overview" className="mt-0">
            <OverviewTab project={project} />
          </TabsContent>
          <TabsContent value="timeline" className="mt-0">
            <TimelineTab project={project} />
          </TabsContent>
          <TabsContent value="code" className="mt-0">
            <CodeTab project={project} />
          </TabsContent>
          <TabsContent value="team" className="mt-0">
            <TeamTab project={project} />
          </TabsContent>
        </Suspense>
      </div>
    </Tabs>
  );

  // Mobile: Sheet from bottom
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={cn(
            "h-[90vh] rounded-t-xl",
            prefersReducedMotion && "transition-none",
          )}
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="truncate">{project.name}</SheetTitle>
            {project.description && (
              <SheetDescription className="line-clamp-2">
                {project.description}
              </SheetDescription>
            )}
          </SheetHeader>
          {modalContent}
          <SheetFooter className="mt-4 border-t pt-4">
            {modalFooter}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop/Tablet: Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[85vh] min-h-[500px] w-full max-w-[min(800px,90vw)] flex-col",
          prefersReducedMotion && "transition-none",
        )}
      >
        <DialogHeader>
          <DialogTitle className="truncate">{project.name}</DialogTitle>
          {project.description && (
            <DialogDescription className="line-clamp-2">
              {project.description}
            </DialogDescription>
          )}
        </DialogHeader>
        {modalContent}
        <DialogFooter className="mt-4 border-t pt-4">
          {modalFooter}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TabLoadingFallback() {
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
