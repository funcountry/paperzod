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
  it("resolves paperclip_agents-style document paths", () => {
    const plan = requirePlan({
      id: "paperclip_paths",
      name: "Paperclip Paths",
      surfaces: [
        {
          id: "role_home_author",
          surfaceClass: "role_home",
          runtimePath: "project_homes/lessons/roles/author/AGENTS.md"
        },
        {
          id: "shared_readme",
          surfaceClass: "shared_entrypoint",
          runtimePath: "project_homes/lessons/shared/README.md"
        },
        {
          id: "workflow_owner",
          surfaceClass: "workflow_owner",
          runtimePath: "project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md"
        },
        {
          id: "technical_ref",
          surfaceClass: "technical_reference",
          runtimePath: "project_homes/lessons/shared/technical_references/POKER_KB.md"
        }
      ],
      generatedTargets: [
        { id: "target_role", path: "project_homes/lessons/roles/author/AGENTS.md", sourceIds: ["role_home_author"] },
        { id: "target_shared", path: "project_homes/lessons/shared/README.md", sourceIds: ["shared_readme"] },
        {
          id: "target_workflow",
          path: "project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
          sourceIds: ["workflow_owner"]
        },
        {
          id: "target_ref",
          path: "project_homes/lessons/shared/technical_references/POKER_KB.md",
          sourceIds: ["technical_ref"]
        }
      ]
    });

    const result = resolveTargetManifest(
      plan,
      createPaperclipMarkdownTarget({
        repoRoot: "/repo",
        outputRoot: "paperclip_agents"
      })
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.documentPaths).toEqual({
      role_home_author: "/repo/paperclip_agents/project_homes/lessons/roles/author/AGENTS.md",
      shared_readme: "/repo/paperclip_agents/project_homes/lessons/shared/README.md",
      technical_ref: "/repo/paperclip_agents/project_homes/lessons/shared/technical_references/POKER_KB.md",
      workflow_owner: "/repo/paperclip_agents/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md"
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
          runtimePath: "project_homes/lessons/shared/README.md"
        },
        {
          id: "surface_b",
          surfaceClass: "workflow_owner",
          runtimePath: "project_homes/lessons/shared/README.md"
        }
      ],
      generatedTargets: [
        { id: "target_a", path: "project_homes/lessons/shared/README.md", sourceIds: ["surface_a"] },
        { id: "target_b", path: "project_homes/lessons/shared/README.md", sourceIds: ["surface_b"] }
      ]
    });

    const result = resolveTargetManifest(
      plan,
      createPaperclipMarkdownTarget({
        repoRoot: "/repo",
        outputRoot: "paperclip_agents"
      })
    );

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["plan.target_path_collision"]);
  });
});
