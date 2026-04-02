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
});
