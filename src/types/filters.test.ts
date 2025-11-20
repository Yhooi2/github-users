import { describe, expectTypeOf, it } from "vitest";
import type {
  RepositoryFilter,
  RepositorySorting,
  SortBy,
  SortDirection,
} from "./filters";

describe("Filter Types", () => {
  describe("SortBy", () => {
    it("should accept valid sort field values", () => {
      const stars: SortBy = "stars";
      const forks: SortBy = "forks";
      const watchers: SortBy = "watchers";
      const commits: SortBy = "commits";
      const size: SortBy = "size";
      const updated: SortBy = "updated";
      const created: SortBy = "created";
      const name: SortBy = "name";

      expectTypeOf(stars).toEqualTypeOf<SortBy>();
      expectTypeOf(forks).toEqualTypeOf<SortBy>();
      expectTypeOf(watchers).toEqualTypeOf<SortBy>();
      expectTypeOf(commits).toEqualTypeOf<SortBy>();
      expectTypeOf(size).toEqualTypeOf<SortBy>();
      expectTypeOf(updated).toEqualTypeOf<SortBy>();
      expectTypeOf(created).toEqualTypeOf<SortBy>();
      expectTypeOf(name).toEqualTypeOf<SortBy>();
    });

    it("should be string literal union type", () => {
      expectTypeOf<SortBy>().toMatchTypeOf<string>();
    });
  });

  describe("SortDirection", () => {
    it("should accept asc and desc", () => {
      const asc: SortDirection = "asc";
      const desc: SortDirection = "desc";

      expectTypeOf(asc).toEqualTypeOf<SortDirection>();
      expectTypeOf(desc).toEqualTypeOf<SortDirection>();
    });

    it("should be string literal union type", () => {
      expectTypeOf<SortDirection>().toMatchTypeOf<string>();
    });
  });

  describe("RepositoryFilter", () => {
    it("should accept empty object", () => {
      const filter: RepositoryFilter = {};
      expectTypeOf(filter).toEqualTypeOf<RepositoryFilter>();
    });

    it("should accept all valid filter properties", () => {
      const filter: RepositoryFilter = {
        originalOnly: true,
        forksOnly: false,
        hideArchived: true,
        language: "TypeScript",
        minStars: 100,
        searchQuery: "test",
        hasTopics: true,
        hasLicense: true,
      };

      expectTypeOf(filter).toEqualTypeOf<RepositoryFilter>();
    });

    it("should accept partial filter properties", () => {
      const filter: RepositoryFilter = {
        language: "JavaScript",
        minStars: 50,
      };

      expectTypeOf(filter).toEqualTypeOf<RepositoryFilter>();
    });

    it("should have optional boolean properties", () => {
      expectTypeOf<RepositoryFilter>()
        .toHaveProperty("originalOnly")
        .toEqualTypeOf<boolean | undefined>();
      expectTypeOf<RepositoryFilter>()
        .toHaveProperty("forksOnly")
        .toEqualTypeOf<boolean | undefined>();
      expectTypeOf<RepositoryFilter>()
        .toHaveProperty("hideArchived")
        .toEqualTypeOf<boolean | undefined>();
      expectTypeOf<RepositoryFilter>()
        .toHaveProperty("hasTopics")
        .toEqualTypeOf<boolean | undefined>();
      expectTypeOf<RepositoryFilter>()
        .toHaveProperty("hasLicense")
        .toEqualTypeOf<boolean | undefined>();
    });

    it("should have optional string properties", () => {
      expectTypeOf<RepositoryFilter>()
        .toHaveProperty("language")
        .toEqualTypeOf<string | undefined>();
      expectTypeOf<RepositoryFilter>()
        .toHaveProperty("searchQuery")
        .toEqualTypeOf<string | undefined>();
    });

    it("should have optional number property", () => {
      expectTypeOf<RepositoryFilter>()
        .toHaveProperty("minStars")
        .toEqualTypeOf<number | undefined>();
    });
  });

  describe("RepositorySorting", () => {
    it("should require both field and direction", () => {
      const sorting: RepositorySorting = {
        field: "stars",
        direction: "desc",
      };

      expectTypeOf(sorting).toEqualTypeOf<RepositorySorting>();
    });

    it("should have field of type SortBy", () => {
      expectTypeOf<RepositorySorting>()
        .toHaveProperty("field")
        .toEqualTypeOf<SortBy>();
    });

    it("should have direction of type SortDirection", () => {
      expectTypeOf<RepositorySorting>()
        .toHaveProperty("direction")
        .toEqualTypeOf<SortDirection>();
    });

    it("should accept all valid sort combinations", () => {
      const sortings: RepositorySorting[] = [
        { field: "stars", direction: "desc" },
        { field: "forks", direction: "asc" },
        { field: "watchers", direction: "desc" },
        { field: "commits", direction: "asc" },
        { field: "size", direction: "desc" },
        { field: "updated", direction: "desc" },
        { field: "created", direction: "asc" },
        { field: "name", direction: "asc" },
      ];

      sortings.forEach((sorting) => {
        expectTypeOf(sorting).toEqualTypeOf<RepositorySorting>();
      });
    });
  });

  describe("Type relationships", () => {
    it("should use SortBy in RepositorySorting", () => {
      expectTypeOf<RepositorySorting["field"]>().toEqualTypeOf<SortBy>();
    });

    it("should use SortDirection in RepositorySorting", () => {
      expectTypeOf<
        RepositorySorting["direction"]
      >().toEqualTypeOf<SortDirection>();
    });
  });
});
