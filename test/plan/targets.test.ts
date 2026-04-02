import { describe, expect, it } from "vitest";

import { buildGraph } from "../../src/graph/index.js";
import { buildCompilePlan, createTargetAdapter, resolveTargetManifest } from "../../src/plan/index.js";
import { normalizeSetup } from "../../src/source/index.js";
import demoMinimalSeed from "../fixtures/source/demo-minimal.js";

function requirePlan(input: unknown) {
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

  const plan = buildCompilePlan(graph.data);
  expect(plan.success).toBe(true);
  if (!plan.success) {
    throw new Error("Expected plan build to succeed.");
  }

  return plan.data;
}

describe("target adapter abstraction", () => {
  it("resolves target paths under a repo and output root", () => {
    const plan = requirePlan(demoMinimalSeed);
    const result = resolveTargetManifest(
      plan,
      createTargetAdapter({
        name: "test",
        repoRoot: "/repo",
        outputRoot: "paperclip_home/project_homes/demo"
      })
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.documentPaths).toEqual({
      author_home: "/repo/paperclip_home/project_homes/demo/generated/roles/author/AGENTS.md",
      workflow_surface: "/repo/paperclip_home/project_homes/demo/generated/WORKFLOW.md"
    });
  });

  it("rejects document paths that escape the configured output root", () => {
    const plan = requirePlan({
      id: "target_escape",
      name: "Target Escape",
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "../outside/WORKFLOW.md" }],
      generatedTargets: [{ id: "target_1", path: "../outside/WORKFLOW.md", sourceIds: ["surface_1"] }]
    });

    const result = resolveTargetManifest(
      plan,
      createTargetAdapter({
        name: "test",
        repoRoot: "/repo",
        outputRoot: "paperclip_home/project_homes/demo"
      })
    );

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["plan.target_path_out_of_scope"]);
  });
});
