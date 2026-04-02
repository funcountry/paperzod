import { describe, expect, it } from "vitest";

import { runChecks } from "../../src/checks/index.js";
import { buildGraph } from "../../src/graph/index.js";
import { normalizeSetup } from "../../src/source/index.js";

function runChecksFor(input: unknown) {
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

  return runChecks(graph.data);
}

describe("surface and reference checks", () => {
  it("accepts valid documents, grounds, and references links", () => {
    expect(
      runChecksFor({
        id: "surface_valid",
        name: "Surface Valid",
        roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
        workflowSteps: [
          {
            id: "step_1",
            roleId: "role_1",
            purpose: "Emit output.",
            requiredInputIds: [],
            requiredOutputIds: ["artifact_1"],
            stopLine: "Stop when complete.",
            nextGateId: "gate_1"
          }
        ],
        reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
        artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
        surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
        surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
        references: [{ id: "ref_1", referenceClass: "grounding_reference", name: "Grounding Ref", sourcePath: "docs/ref/GROUNDING.md" }],
        links: [
          { id: "owns_1", kind: "owns", from: "role_1", to: "section_1" },
          {
            id: "reads_1",
            kind: "reads",
            from: "role_1",
            to: "surface_1",
            condition: "When you need the whole workflow owner.",
            context: "Read the whole owner doc before checking lane-specific sections."
          },
          { id: "checks_1", kind: "checks", from: "gate_1", to: "section_1" },
          { id: "documents_1", kind: "documents", from: "section_1", to: "step_1" },
          { id: "grounds_1", kind: "grounds", from: "step_1", to: "ref_1" },
          { id: "references_1", kind: "references", from: "role_1", to: "ref_1" }
        ]
      })
    ).toEqual([]);
  });

  it("rejects orphaned sections, duplicate section slugs, and missing surfaces", () => {
    const diagnostics = runChecksFor({
      id: "surface_section_conflicts",
      name: "Surface Section Conflicts",
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
      surfaceSections: [
        { id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" },
        { id: "section_2", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First Again" },
        { id: "section_3", surfaceId: "missing_surface", stableSlug: "role-contract", title: "Role Contract" }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.surface_section.duplicate_slug",
      "check.surface_section.missing_surface",
      "check.surface_section.orphaned",
      "check.surface_section.orphaned",
      "check.surface_section.orphaned"
    ]);
  });

  it("rejects invalid documents, grounds, references, and reads links", () => {
    const diagnostics = runChecksFor({
      id: "surface_link_conflicts",
      name: "Surface Link Conflicts",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Emit output.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop when complete.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
      surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
      references: [{ id: "ref_1", referenceClass: "grounding_reference", name: "Grounding Ref", sourcePath: "docs/ref/GROUNDING.md" }],
      links: [
        { id: "owns_1", kind: "owns", from: "artifact_1", to: "section_1" },
        { id: "owns_2", kind: "owns", from: "role_1", to: "gate_1" },
        { id: "reads_1", kind: "reads", from: "surface_1", to: "section_1" },
        { id: "reads_2", kind: "reads", from: "role_1", to: "artifact_1" },
        { id: "checks_1", kind: "checks", from: "role_1", to: "section_1" },
        { id: "checks_2", kind: "checks", from: "gate_1", to: "ref_1" },
        { id: "documents_1", kind: "documents", from: "role_1", to: "step_1" },
        { id: "grounds_0", kind: "grounds", from: "artifact_1", to: "ref_1" },
        { id: "grounds_1", kind: "grounds", from: "step_1", to: "surface_1" },
        { id: "references_0", kind: "references", from: "artifact_1", to: "ref_1" },
        { id: "references_1", kind: "references", from: "step_1", to: "artifact_1" }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.link.checks_source_invalid",
      "check.link.checks_target_invalid",
      "check.link.documents_source_invalid",
      "check.link.grounds_source_invalid",
      "check.link.grounds_target_invalid",
      "check.link.owns_source_invalid",
      "check.link.owns_target_invalid",
      "check.link.reads_source_invalid",
      "check.link.reads_target_invalid",
      "check.link.references_source_invalid",
      "check.link.references_target_invalid"
    ]);
  });

  it("rejects conflicting canonical owners", () => {
    const diagnostics = runChecksFor({
      id: "surface_owner_conflicts",
      name: "Surface Owner Conflicts",
      roles: [
        { id: "owner_a", name: "Owner A", purpose: "Own doctrine." },
        { id: "owner_b", name: "Owner B", purpose: "Also own doctrine." }
      ],
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
      surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
      links: [
        { id: "owner_a_link", kind: "owns", from: "owner_a", to: "section_1" },
        { id: "owner_b_link", kind: "owns", from: "owner_b", to: "section_1" }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["check.ownership.conflicting_owner"]);
  });

  it("accepts nested section hierarchies and does not orphan grouping parents", () => {
    expect(
      runChecksFor({
        id: "surface_section_hierarchy_valid",
        name: "Surface Section Hierarchy Valid",
        roles: [{ id: "role_1", name: "Role 1", purpose: "Own doctrine." }],
        surfaces: [{ id: "surface_1", surfaceClass: "shared_entrypoint", runtimePath: "paperclip_home/project_homes/lessons/shared/README.md" }],
        surfaceSections: [
          { id: "terms", surfaceId: "surface_1", stableSlug: "terms", title: "Terms" },
          { id: "workflow_items", surfaceId: "surface_1", stableSlug: "workflow-items", title: "Workflow Items", parentSectionId: "terms" }
        ],
        links: [
          { id: "owns_1", kind: "owns", from: "role_1", to: "workflow_items" },
          { id: "documents_1", kind: "documents", from: "workflow_items", to: "role_1" }
        ]
      })
    ).toEqual([]);
  });

  it("rejects missing parents and cross-surface parent links", () => {
    const diagnostics = runChecksFor({
      id: "surface_section_parent_conflicts",
      name: "Surface Section Parent Conflicts",
      surfaces: [
        { id: "surface_1", surfaceClass: "shared_entrypoint", runtimePath: "generated/README.md" },
        { id: "surface_2", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }
      ],
      surfaceSections: [
        { id: "terms", surfaceId: "surface_1", stableSlug: "terms", title: "Terms" },
        { id: "missing_parent_child", surfaceId: "surface_1", stableSlug: "workflow-items", title: "Workflow Items", parentSectionId: "missing" },
        { id: "cross_surface_child", surfaceId: "surface_2", stableSlug: "owner-map", title: "Owner Map", parentSectionId: "terms" }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.surface_section.missing_parent",
      "check.surface_section.orphaned",
      "check.surface_section.orphaned",
      "check.surface_section.parent_surface_mismatch"
    ]);
  });

  it("rejects child-before-parent subsection declarations", () => {
    const diagnostics = runChecksFor({
      id: "surface_section_parent_order_conflicts",
      name: "Surface Section Parent Order Conflicts",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Own doctrine." }],
      surfaces: [{ id: "surface_1", surfaceClass: "shared_entrypoint", runtimePath: "generated/README.md" }],
      surfaceSections: [
        { id: "workflow_items", surfaceId: "surface_1", stableSlug: "workflow-items", title: "Workflow Items", parentSectionId: "terms" },
        { id: "terms", surfaceId: "surface_1", stableSlug: "terms", title: "Terms" }
      ],
      links: [
        { id: "owns_1", kind: "owns", from: "role_1", to: "workflow_items" },
        { id: "documents_1", kind: "documents", from: "workflow_items", to: "role_1" }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["check.surface_section.parent_declared_after_child"]);
  });
});
