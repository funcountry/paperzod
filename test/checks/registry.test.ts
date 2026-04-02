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
});
