/**
 * Level 2 components - Full analytics modal with tabs
 *
 * These components implement the third level of progressive disclosure,
 * providing comprehensive project analytics in a modal/sheet interface.
 */

export { ProjectAnalyticsModal } from "./ProjectAnalyticsModal";
export type {
  ProjectAnalyticsModalProps,
  ProjectForModal,
} from "./ProjectAnalyticsModal";

// Tab components (lazy loaded in modal)
export { OverviewTab } from "./tabs/OverviewTab";
export { TimelineTab } from "./tabs/TimelineTab";
export { CodeTab } from "./tabs/CodeTab";
export { TeamTab } from "./tabs/TeamTab";
