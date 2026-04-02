import { describe, expect, it } from "vitest";

import { compareStableIds, findDuplicateIds, makeStableId, toSectionSlug } from "../../src/core/ids.js";

describe("core ids", () => {
  it("normalizes stable ids", () => {
    expect(makeStableId("Section Dossier Engineer")).toBe("section_dossier_engineer");
  });

  it("creates stable section slugs", () => {
    expect(toSectionSlug("Read First")).toBe("read-first");
    expect(toSectionSlug("Role Contract")).toBe("role-contract");
  });

  it("compares ids deterministically", () => {
    expect(["b", "a"].sort(compareStableIds)).toEqual(["a", "b"]);
  });

  it("finds duplicate ids", () => {
    expect(findDuplicateIds(["alpha", "beta", "alpha", "beta", "gamma"])).toEqual(["alpha", "beta"]);
  });
});
