import { describe, expect, it } from "vitest";

import { buildGraph } from "../../src/graph/index.js";
import { buildCompilePlan, createPaperclipMarkdownTarget, resolveTargetManifest } from "../../src/plan/index.js";
import { normalizeSetup } from "../../src/source/index.js";

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

describe("Paperclip markdown target", () => {
  it("resolves Paperclip-style document paths", () => {
    const plan = requirePlan({
      id: "paperclip_paths",
      name: "Paperclip Paths",
      surfaces: [
        {
          id: "role_home_author",
          surfaceClass: "role_home",
          runtimePath: "paperclip_home/agents/author/AGENTS.md"
        },
        {
          id: "project_home_root",
          surfaceClass: "project_home_root",
          runtimePath: "paperclip_home/project_homes/editorial/README.md"
        },
        {
          id: "shared_readme",
          surfaceClass: "shared_entrypoint",
          runtimePath: "paperclip_home/project_homes/editorial/shared/README.md"
        },
        {
          id: "workflow_owner",
          surfaceClass: "workflow_owner",
          runtimePath: "paperclip_home/project_homes/editorial/shared/AUTHORITATIVE_EDITORIAL_WORKFLOW.md"
        },
        {
          id: "technical_ref",
          surfaceClass: "technical_reference",
          runtimePath: "paperclip_home/project_homes/editorial/shared/technical_references/AUDIENCE_RESEARCH_KB.md"
        }
      ],
      generatedTargets: [
        { id: "target_role", path: "paperclip_home/agents/author/AGENTS.md", sourceIds: ["role_home_author"] },
        { id: "target_root", path: "paperclip_home/project_homes/editorial/README.md", sourceIds: ["project_home_root"] },
        { id: "target_shared", path: "paperclip_home/project_homes/editorial/shared/README.md", sourceIds: ["shared_readme"] },
        {
          id: "target_workflow",
          path: "paperclip_home/project_homes/editorial/shared/AUTHORITATIVE_EDITORIAL_WORKFLOW.md",
          sourceIds: ["workflow_owner"]
        },
        {
          id: "target_ref",
          path: "paperclip_home/project_homes/editorial/shared/technical_references/AUDIENCE_RESEARCH_KB.md",
          sourceIds: ["technical_ref"]
        }
      ]
    });

    const result = resolveTargetManifest(
      plan,
      createPaperclipMarkdownTarget({
        repoRoot: "/repo",
        outputRoot: "."
      })
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.documentPaths).toEqual({
      project_home_root: "/repo/paperclip_home/project_homes/editorial/README.md",
      role_home_author: "/repo/paperclip_home/agents/author/AGENTS.md",
      shared_readme: "/repo/paperclip_home/project_homes/editorial/shared/README.md",
      technical_ref: "/repo/paperclip_home/project_homes/editorial/shared/technical_references/AUDIENCE_RESEARCH_KB.md",
      workflow_owner: "/repo/paperclip_home/project_homes/editorial/shared/AUTHORITATIVE_EDITORIAL_WORKFLOW.md"
    });
  });

  it("rejects target collisions after path resolution", () => {
    const plan = requirePlan({
      id: "paperclip_collisions",
      name: "Paperclip Collisions",
      surfaces: [
        {
          id: "surface_a",
          surfaceClass: "shared_entrypoint",
          runtimePath: "paperclip_home/project_homes/editorial/shared/README.md"
        },
        {
          id: "surface_b",
          surfaceClass: "shared_entrypoint",
          runtimePath: "paperclip_home/project_homes/editorial/shared/README.md"
        }
      ],
      generatedTargets: [
        { id: "target_a", path: "paperclip_home/project_homes/editorial/shared/README.md", sourceIds: ["surface_a"] },
        { id: "target_b", path: "paperclip_home/project_homes/editorial/shared/README.md", sourceIds: ["surface_b"] }
      ]
    });

    const result = resolveTargetManifest(
      plan,
      createPaperclipMarkdownTarget({
        repoRoot: "/repo",
        outputRoot: "."
      })
    );

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["plan.target_path_collision"]);
  });
});
