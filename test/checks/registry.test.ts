import { describe, expect, it } from "vitest";

import { buildGraph } from "../../src/graph/index.js";
import { defaultCheckRules, runChecks } from "../../src/checks/index.js";
import { normalizeSetup } from "../../src/source/index.js";

function requireDiagnostics(input: unknown) {
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

describe("check registry", () => {
  it("exports a stable default rule list", () => {
    expect(defaultCheckRules.map((rule) => rule.id)).toMatchInlineSnapshot(`
      [
        "workflow_contracts",
        "artifact_and_packet_semantics",
        "registry_and_evidence_semantics",
        "surface_and_reference_semantics",
      ]
    `);
  });

  it("returns diagnostics in deterministic order", () => {
    const diagnostics = requireDiagnostics({
      id: "registry_ordering",
      name: "Registry Ordering",
      workflowSteps: [
        {
          id: "step_1",
          roleId: "missing_role",
          purpose: "Emit output.",
          requiredInputIds: ["missing_input"],
          requiredOutputIds: ["missing_output"],
          stopLine: "Stop when complete."
        }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.workflow.missing_required_input",
      "check.workflow.missing_required_output",
      "check.workflow.missing_role",
      "check.workflow.missing_route"
    ]);
  });

  it("runs setup-local rules alongside the defaults", () => {
    const normalized = normalizeSetup({
      id: "registry_local_rule",
      name: "Registry Local Rule"
    });
    expect(normalized.success).toBe(true);
    if (!normalized.success) {
      throw new Error("Expected setup normalization to succeed.");
    }

    const graph = buildGraph(normalized.data);
    expect(graph.success).toBe(true);
    if (!graph.success) {
      throw new Error("Expected graph build to succeed.");
    }

    const diagnostics = runChecks(graph.data, [
      {
        id: "local_rule",
        run: () => [
          {
            code: "check.local.rule_fired",
            severity: "error",
            phase: "check",
            message: "Local rule fired."
          }
        ]
      }
    ]);

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["check.local.rule_fired"]);
  });

  it("fails loudly on duplicate rule ids", () => {
    const normalized = normalizeSetup({
      id: "registry_duplicate_rule",
      name: "Registry Duplicate Rule"
    });
    expect(normalized.success).toBe(true);
    if (!normalized.success) {
      throw new Error("Expected setup normalization to succeed.");
    }

    const graph = buildGraph(normalized.data);
    expect(graph.success).toBe(true);
    if (!graph.success) {
      throw new Error("Expected graph build to succeed.");
    }

    const diagnostics = runChecks(graph.data, [
      {
        id: "workflow_contracts",
        run: () => []
      }
    ]);

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["check.registry.duplicate_rule_id"]);
    expect(diagnostics[0]?.message).toContain('Check rule id "workflow_contracts"');
  });

  it("diagnoses duplicate registry ids and duplicate registry entry ids", () => {
    const diagnostics = requireDiagnostics({
      id: "registry_duplicates",
      name: "Registry Duplicates",
      registries: [
        {
          id: "publish_result",
          name: "Publish Result",
          entries: [
            { id: "pass", label: "PASS" },
            { id: "pass", label: "PASS Again" }
          ]
        },
        {
          id: "publish_result",
          name: "Publish Result Copy",
          entries: [{ id: "revise", label: "Revise" }]
        }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.registry.duplicate_entry_id",
      "check.registry.duplicate_registry_id"
    ]);
  });

  it("diagnoses unknown allowed-value registry references", () => {
    const diagnostics = requireDiagnostics({
      id: "registry_allowed_value_refs",
      name: "Registry Allowed Value Refs",
      registries: [
        {
          id: "publish_result",
          name: "Publish Result",
          entries: [{ id: "pass", label: "PASS" }]
        }
      ],
      artifacts: [
        {
          id: "authority_note",
          name: "Authority Note",
          artifactClass: "required",
          evidence: {
            requiredClaims: [
              {
                id: "publish_decision",
                label: "Publish decision",
                allowedValue: { registryId: "publish_result", entryId: "missing_entry" }
              },
              {
                id: "approval_scope",
                label: "Approval scope",
                allowedValue: { registryId: "missing_registry", entryId: "pass" }
              }
            ]
          }
        }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.registry.unknown_allowed_value_entry",
      "check.registry.unknown_allowed_value_registry"
    ]);
  });

  it("diagnoses missing and circular artifact evidence dependencies", () => {
    const diagnostics = requireDiagnostics({
      id: "artifact_evidence_dependencies",
      name: "Artifact Evidence Dependencies",
      artifacts: [
        {
          id: "authority_note",
          name: "Authority Note",
          artifactClass: "required",
          evidence: {
            requiredArtifactIds: ["review_receipt", "missing_receipt"]
          }
        },
        {
          id: "review_receipt",
          name: "Review Receipt",
          artifactClass: "support",
          evidence: {
            requiredArtifactIds: ["authority_note"]
          }
        }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.artifact_evidence.circular_dependency",
      "check.artifact_evidence.circular_dependency",
      "check.artifact_evidence.unknown_required_artifact"
    ]);
  });
});
