import { useCallback, useEffect, useMemo, useState } from "react";

export type TabName = "overview" | "timeline" | "code" | "team";

export interface ProgressiveDisclosureState {
  /** Set of expanded project IDs (Level 1) */
  expandedProjects: Set<string>;
  /** Whether the modal is open (Level 2) */
  modalOpen: boolean;
  /** ID of the project shown in modal */
  selectedProjectId: string | null;
  /** Active tab in the modal */
  activeTab: TabName;
}

export interface ProgressiveDisclosureActions {
  /** Toggle project expansion (Level 1) */
  toggleProject: (projectId: string) => void;
  /** Expand a specific project */
  expandProject: (projectId: string) => void;
  /** Collapse a specific project */
  collapseProject: (projectId: string) => void;
  /** Collapse all projects */
  collapseAll: () => void;
  /** Open modal for a project (Level 2) */
  openModal: (projectId: string, tab?: TabName) => void;
  /** Close the modal */
  closeModal: () => void;
  /** Change active tab in modal */
  setActiveTab: (tab: TabName) => void;
  /** Check if a project is expanded */
  isExpanded: (projectId: string) => boolean;
}

export interface UseProgressiveDisclosureOptions {
  /** Allow multiple projects to be expanded at once (desktop: true, mobile: false) */
  allowMultipleExpanded?: boolean;
  /** Persist modal state to URL */
  persistToUrl?: boolean;
}

const DEFAULT_TAB: TabName = "overview";
const URL_PARAM_MODAL = "modal";
const URL_PARAM_TAB = "tab";

/**
 * React hook for managing 3-level progressive disclosure state
 *
 * Manages the state for:
 * - Level 0: Compact list (default view)
 * - Level 1: Expanded project cards (toggleable)
 * - Level 2: Full modal with tabs (URL-persisted)
 *
 * @param options - Configuration options
 * @returns State and actions for managing disclosure levels
 *
 * @example
 * ```typescript
 * function ProjectList({ projects }) {
 *   const { isMobile } = useResponsive();
 *   const {
 *     isExpanded,
 *     toggleProject,
 *     openModal,
 *     modalOpen,
 *     selectedProjectId,
 *     activeTab,
 *     setActiveTab,
 *     closeModal,
 *   } = useProgressiveDisclosure({
 *     allowMultipleExpanded: !isMobile,
 *     persistToUrl: true,
 *   });
 *
 *   return (
 *     <>
 *       {projects.map(project => (
 *         <ProjectCard
 *           key={project.id}
 *           project={project}
 *           expanded={isExpanded(project.id)}
 *           onToggle={() => toggleProject(project.id)}
 *           onViewAnalytics={() => openModal(project.id)}
 *         />
 *       ))}
 *       {modalOpen && selectedProjectId && (
 *         <ProjectModal
 *           projectId={selectedProjectId}
 *           activeTab={activeTab}
 *           onTabChange={setActiveTab}
 *           onClose={closeModal}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export function useProgressiveDisclosure(
  options: UseProgressiveDisclosureOptions = {},
): ProgressiveDisclosureState & ProgressiveDisclosureActions {
  const { allowMultipleExpanded = true, persistToUrl = true } = options;

  // Parse initial state from URL if persistence is enabled
  const getInitialState = useCallback((): ProgressiveDisclosureState => {
    let selectedProjectId: string | null = null;
    let activeTab: TabName = DEFAULT_TAB;
    let modalOpen = false;

    if (persistToUrl && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const modalParam = params.get(URL_PARAM_MODAL);
      const tabParam = params.get(URL_PARAM_TAB) as TabName | null;

      if (modalParam) {
        selectedProjectId = modalParam;
        modalOpen = true;
        if (
          tabParam &&
          ["overview", "timeline", "code", "team"].includes(tabParam)
        ) {
          activeTab = tabParam;
        }
      }
    }

    return {
      expandedProjects: new Set(),
      modalOpen,
      selectedProjectId,
      activeTab,
    };
  }, [persistToUrl]);

  const [state, setState] = useState<ProgressiveDisclosureState>(getInitialState);

  // Update URL when modal state changes
  useEffect(() => {
    if (!persistToUrl || typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);

    if (state.modalOpen && state.selectedProjectId) {
      url.searchParams.set(URL_PARAM_MODAL, state.selectedProjectId);
      url.searchParams.set(URL_PARAM_TAB, state.activeTab);
    } else {
      url.searchParams.delete(URL_PARAM_MODAL);
      url.searchParams.delete(URL_PARAM_TAB);
    }

    // Use replaceState to avoid polluting browser history
    window.history.replaceState({}, "", url.toString());
  }, [state.modalOpen, state.selectedProjectId, state.activeTab, persistToUrl]);

  // Handle browser back/forward navigation
  useEffect(() => {
    if (!persistToUrl || typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const modalParam = params.get(URL_PARAM_MODAL);
      const tabParam = params.get(URL_PARAM_TAB) as TabName | null;

      if (modalParam) {
        setState((prev) => ({
          ...prev,
          modalOpen: true,
          selectedProjectId: modalParam,
          activeTab:
            tabParam &&
            ["overview", "timeline", "code", "team"].includes(tabParam)
              ? tabParam
              : DEFAULT_TAB,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          modalOpen: false,
          selectedProjectId: null,
          activeTab: DEFAULT_TAB,
        }));
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [persistToUrl]);

  // Actions
  const toggleProject = useCallback(
    (projectId: string) => {
      setState((prev) => {
        const newExpanded = new Set(prev.expandedProjects);

        if (newExpanded.has(projectId)) {
          newExpanded.delete(projectId);
        } else {
          if (!allowMultipleExpanded) {
            newExpanded.clear();
          }
          newExpanded.add(projectId);
        }

        return { ...prev, expandedProjects: newExpanded };
      });
    },
    [allowMultipleExpanded],
  );

  const expandProject = useCallback(
    (projectId: string) => {
      setState((prev) => {
        const newExpanded = new Set(
          allowMultipleExpanded ? prev.expandedProjects : [],
        );
        newExpanded.add(projectId);
        return { ...prev, expandedProjects: newExpanded };
      });
    },
    [allowMultipleExpanded],
  );

  const collapseProject = useCallback((projectId: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedProjects);
      newExpanded.delete(projectId);
      return { ...prev, expandedProjects: newExpanded };
    });
  }, []);

  const collapseAll = useCallback(() => {
    setState((prev) => ({ ...prev, expandedProjects: new Set() }));
  }, []);

  const openModal = useCallback((projectId: string, tab: TabName = DEFAULT_TAB) => {
    setState((prev) => ({
      ...prev,
      modalOpen: true,
      selectedProjectId: projectId,
      activeTab: tab,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      modalOpen: false,
      selectedProjectId: null,
      activeTab: DEFAULT_TAB,
    }));
  }, []);

  const setActiveTab = useCallback((tab: TabName) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const isExpanded = useCallback(
    (projectId: string) => state.expandedProjects.has(projectId),
    [state.expandedProjects],
  );

  return useMemo(
    () => ({
      ...state,
      toggleProject,
      expandProject,
      collapseProject,
      collapseAll,
      openModal,
      closeModal,
      setActiveTab,
      isExpanded,
    }),
    [
      state,
      toggleProject,
      expandProject,
      collapseProject,
      collapseAll,
      openModal,
      closeModal,
      setActiveTab,
      isExpanded,
    ],
  );
}
