import { describe, expect, it } from "vitest";
import type { RepositoryContribution } from "@/apollo/queries/yearContributions";
import {
  toCompactProject,
  toCompactProjects,
  toExpandableProject,
  toExpandableProjects,
  toProjectForModal,
} from "./project-adapter";

// Mock repository contribution
const createMockContribution = (
  overrides: Partial<{
    id: string;
    name: string;
    ownerLogin: string;
    totalCount: number;
    stargazerCount: number;
    forkCount: number;
    language: string | null;
    description: string | null;
    url: string;
  }> = {},
): RepositoryContribution => ({
  contributions: {
    totalCount: overrides.totalCount ?? 150,
  },
  repository: {
    id: overrides.id ?? "repo-1",
    name: overrides.name ?? "test-repo",
    nameWithOwner: `${overrides.ownerLogin ?? "testuser"}/${overrides.name ?? "test-repo"}`,
    url: overrides.url ?? "https://github.com/testuser/test-repo",
    description: overrides.description ?? "A test repository",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    pushedAt: "2024-01-01T00:00:00Z",
    stargazerCount: overrides.stargazerCount ?? 100,
    forkCount: overrides.forkCount ?? 25,
    isFork: false,
    isTemplate: false,
    isArchived: false,
    isPrivate: false,
    diskUsage: 1000,
    homepageUrl: null,
    primaryLanguage: overrides.language
      ? { name: overrides.language, color: "#3178c6" }
      : null,
    owner: {
      login: overrides.ownerLogin ?? "testuser",
      avatarUrl: "https://github.com/testuser.png",
    },
    parent: null,
    watchers: { totalCount: 10 },
    issues: { totalCount: 5 },
    repositoryTopics: { nodes: [] },
    languages: { totalSize: 1000, edges: [] },
    licenseInfo: null,
    defaultBranchRef: null,
  },
});

describe("project-adapter", () => {
  describe("toCompactProject", () => {
    it("converts RepositoryContribution to CompactProject correctly", () => {
      const contribution = createMockContribution({
        id: "repo-123",
        name: "my-project",
        ownerLogin: "alice",
        totalCount: 200,
        stargazerCount: 500,
        language: "TypeScript",
        description: "My awesome project",
        url: "https://github.com/alice/my-project",
      });

      const result = toCompactProject(contribution, "alice");

      expect(result).toEqual({
        id: "repo-123",
        name: "my-project",
        commits: 200,
        stars: 500,
        language: "TypeScript",
        isOwner: true,
        description: "My awesome project",
        url: "https://github.com/alice/my-project",
      });
    });

    it("marks isOwner as false when username does not match", () => {
      const contribution = createMockContribution({
        ownerLogin: "alice",
      });

      const result = toCompactProject(contribution, "bob");

      expect(result.isOwner).toBe(false);
    });

    it("handles null language", () => {
      const contribution = createMockContribution({
        language: null,
      });

      const result = toCompactProject(contribution, "testuser");

      expect(result.language).toBe("");
    });

    it("handles null description", () => {
      // Explicitly create contribution with null description
      const contribution: RepositoryContribution = {
        contributions: { totalCount: 100 },
        repository: {
          ...createMockContribution().repository,
          description: null,
        },
      };

      const result = toCompactProject(contribution, "testuser");

      expect(result.description).toBeUndefined();
    });
  });

  describe("toExpandableProject", () => {
    it("includes forks in the result", () => {
      const contribution = createMockContribution({
        forkCount: 42,
      });

      const result = toExpandableProject(contribution, "testuser");

      expect(result.forks).toBe(42);
    });

    it("includes all CompactProject fields plus forks", () => {
      const contribution = createMockContribution({
        id: "repo-456",
        name: "expandable-repo",
        ownerLogin: "developer",
        totalCount: 300,
        stargazerCount: 1000,
        forkCount: 50,
        language: "JavaScript",
        description: "A repo that expands",
        url: "https://github.com/developer/expandable-repo",
      });

      const result = toExpandableProject(contribution, "developer");

      expect(result).toMatchObject({
        id: "repo-456",
        name: "expandable-repo",
        commits: 300,
        stars: 1000,
        forks: 50,
        language: "JavaScript",
        isOwner: true,
        description: "A repo that expands",
        url: "https://github.com/developer/expandable-repo",
      });
    });
  });

  describe("toProjectForModal", () => {
    it("extracts only the fields needed for modal", () => {
      const contribution = createMockContribution({
        id: "modal-repo",
        name: "modal-project",
        stargazerCount: 2500,
        forkCount: 100,
        description: "Project for modal view",
        url: "https://github.com/user/modal-project",
      });

      const result = toProjectForModal(contribution);

      expect(result).toEqual({
        id: "modal-repo",
        name: "modal-project",
        description: "Project for modal view",
        url: "https://github.com/user/modal-project",
        stars: 2500,
        forks: 100,
      });
    });

    it("handles null description", () => {
      // Need to explicitly set description to null in the repository
      const contribution: RepositoryContribution = {
        contributions: { totalCount: 100 },
        repository: {
          ...createMockContribution().repository,
          description: null,
        },
      };

      const result = toProjectForModal(contribution);

      expect(result.description).toBeUndefined();
    });
  });

  describe("toCompactProjects", () => {
    it("converts array of contributions", () => {
      const contributions = [
        createMockContribution({ id: "repo-1", name: "repo-one", ownerLogin: "user" }),
        createMockContribution({ id: "repo-2", name: "repo-two", ownerLogin: "other" }),
      ];

      const result = toCompactProjects(contributions, "user");

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("repo-one");
      expect(result[0].isOwner).toBe(true);
      expect(result[1].name).toBe("repo-two");
      expect(result[1].isOwner).toBe(false);
    });

    it("returns empty array for empty input", () => {
      const result = toCompactProjects([], "user");

      expect(result).toEqual([]);
    });
  });

  describe("toExpandableProjects", () => {
    it("converts array of contributions to expandable projects", () => {
      const contributions = [
        createMockContribution({ id: "repo-1", forkCount: 10 }),
        createMockContribution({ id: "repo-2", forkCount: 20 }),
      ];

      const result = toExpandableProjects(contributions, "testuser");

      expect(result).toHaveLength(2);
      expect(result[0].forks).toBe(10);
      expect(result[1].forks).toBe(20);
    });
  });
});
