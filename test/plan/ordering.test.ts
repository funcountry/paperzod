import { describe, expect, it } from "vitest";

import { buildGraph } from "../../src/graph/index.js";
import { buildCompilePlan } from "../../src/plan/index.js";
import { normalizeSetup } from "../../src/source/index.js";

function requireGraph(input: unknown) {
  const normalized = normalizeSetup(input);
  expect(normalized.success).toBe(true);
  if (!normalized.success) {
    throw new Error("Expected setup normalization to succeed.");
  }

  const graph = buildGraph(normalized.data);
  expect(graph.success).toBe(true);
  if (!graph.success) {
    throw new Error("Expected graph build to succeed.");
  }

  return graph.data;
}

describe("compile plan ordering", () => {
  it("preserves authored declaration order for documents and sections", () => {
    const canonical = requireGraph({
      id: "ordering_demo",
      name: "Ordering Demo",
      surfaces: [
        { id: "surface_b", surfaceClass: "standard", runtimePath: "generated/B.md" },
        { id: "surface_a", surfaceClass: "workflow_owner", runtimePath: "generated/A.md" }
      ],
      surfaceSections: [
        { id: "section_b", surfaceId: "surface_a", stableSlug: "zeta", title: "Zeta" },
        { id: "section_a", surfaceId: "surface_a", stableSlug: "alpha", title: "Alpha" }
      ],
      generatedTargets: [
        { id: "target_b", path: "generated/B.md", sourceIds: ["surface_b"] },
        { id: "target_a_alpha", path: "generated/A.md", sourceIds: ["section_a"], sectionId: "section_a" },
        { id: "target_a_zeta", path: "generated/A.md", sourceIds: ["section_b"], sectionId: "section_b" }
      ]
    });

    const reversed = requireGraph({
      id: "ordering_demo",
      name: "Ordering Demo",
      surfaces: [
        { id: "surface_a", surfaceClass: "workflow_owner", runtimePath: "generated/A.md" },
        { id: "surface_b", surfaceClass: "standard", runtimePath: "generated/B.md" }
      ],
      surfaceSections: [
        { id: "section_a", surfaceId: "surface_a", stableSlug: "alpha", title: "Alpha" },
        { id: "section_b", surfaceId: "surface_a", stableSlug: "zeta", title: "Zeta" }
      ],
      generatedTargets: [
        { id: "target_a_alpha", path: "generated/A.md", sourceIds: ["section_a"], sectionId: "section_a" },
        { id: "target_a_zeta", path: "generated/A.md", sourceIds: ["section_b"], sectionId: "section_b" },
        { id: "target_b", path: "generated/B.md", sourceIds: ["surface_b"] }
      ]
    });

    const canonicalPlan = buildCompilePlan(canonical);
    const reversedPlan = buildCompilePlan(reversed);

    expect(canonicalPlan.success).toBe(true);
    expect(reversedPlan.success).toBe(true);
    if (!canonicalPlan.success || !reversedPlan.success) {
      return;
    }

    expect(canonicalPlan.data.documents.map((document) => document.id)).toEqual(["surface_b", "surface_a"]);
    expect(canonicalPlan.data.sections.map((section) => section.id)).toEqual(["section_b", "section_a"]);
    expect(reversedPlan.data.documents.map((document) => document.id)).toEqual(["surface_a", "surface_b"]);
    expect(reversedPlan.data.sections.map((section) => section.id)).toEqual(["section_a", "section_b"]);
    expect(canonicalPlan.data).not.toEqual(reversedPlan.data);
  });

  it("fails when a section has conflicting owners", () => {
    const graph = requireGraph({
      id: "owner_conflict",
      name: "Owner Conflict",
      roles: [
        { id: "owner_a", name: "Owner A", purpose: "Own sections." },
        { id: "owner_b", name: "Owner B", purpose: "Also own sections." }
      ],
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
      surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
      generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["section_1"], sectionId: "section_1" }],
      links: [
        { id: "owner_a_link", kind: "owns", from: "owner_a", to: "section_1" },
        { id: "owner_b_link", kind: "owns", from: "owner_b", to: "section_1" }
      ]
    });

    const result = buildCompilePlan(graph);

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["plan.conflicting_section_owner"]);
  });
});
