import { describe, expect, it } from "vitest";

import { compareDiagnostics, createDiagnostic, sortDiagnostics, type Diagnostic } from "../../src/core/diagnostics.js";

describe("core diagnostics", () => {
  it("serializes a stable diagnostic shape", () => {
    expect(
      createDiagnostic({
        code: "graph.missing_node",
        severity: "error",
        phase: "graph",
        message: "Missing target node.",
        nodeId: "step_1",
        relatedIds: ["target_2", "target_1"]
      })
    ).toMatchInlineSnapshot(`
      {
        "code": "graph.missing_node",
        "message": "Missing target node.",
        "nodeId": "step_1",
        "phase": "graph",
        "relatedIds": [
          "target_1",
          "target_2",
        ],
        "severity": "error",
      }
    `);
  });

  it("orders diagnostics deterministically", () => {
    const diagnostics: Diagnostic[] = [
      createDiagnostic({
        code: "render.problem",
        severity: "warning",
        phase: "render",
        message: "Render warning."
      }),
      createDiagnostic({
        code: "graph.problem",
        severity: "error",
        phase: "graph",
        message: "Graph error."
      })
    ];

    expect(sortDiagnostics(diagnostics).map((diagnostic) => diagnostic.code)).toEqual(["graph.problem", "render.problem"]);
    expect(compareDiagnostics(diagnostics[0]!, diagnostics[1]!)).toBeGreaterThan(0);
  });
});
