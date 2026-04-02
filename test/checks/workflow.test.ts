import { describe, expect, it } from "vitest";

import { buildGraph } from "../../src/graph/index.js";
import { runChecks } from "../../src/checks/index.js";
import { normalizeSetup } from "../../src/source/index.js";
import demoMinimalSeed from "../fixtures/source/demo-minimal.js";

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

describe("workflow checks", () => {
  it("accepts a valid workflow contract", () => {
    expect(runChecksFor(demoMinimalSeed)).toEqual([]);
  });

  it("accepts link-based routes_to workflow routing", () => {
    expect(
      runChecksFor({
        id: "workflow_link_route",
        name: "Workflow Link Route",
        roles: [
          { id: "author", name: "Author", purpose: "Draft the packet." },
          { id: "critic", name: "Critic", purpose: "Review the packet." }
        ],
        workflowSteps: [
          {
            id: "draft_packet",
            roleId: "author",
            purpose: "Draft the packet.",
            requiredInputIds: [],
            requiredOutputIds: ["packet_v1"],
            stopLine: "Stop once the packet draft exists."
          }
        ],
        reviewGates: [{ id: "critic_gate", name: "Critic Gate", purpose: "Review the packet.", checkIds: ["packet_v1"] }],
        artifacts: [{ id: "packet_v1", name: "PACKET_V1.md", artifactClass: "required" }],
        links: [{ id: "draft_routes_to_gate", kind: "routes_to", from: "draft_packet", to: "critic_gate" }]
      })
    ).toEqual([]);
  });

  it("fails missing workflow role, route, and required references", () => {
    const diagnostics = runChecksFor({
      id: "workflow_missing_refs",
      name: "Workflow Missing Refs",
      workflowSteps: [
        {
          id: "step_1",
          roleId: "missing_role",
          purpose: "Produce output.",
          requiredInputIds: ["missing_input"],
          requiredOutputIds: ["missing_output"],
          stopLine: "Stop when the output exists."
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

  it("fails invalid routes_to link sources and targets", () => {
    const diagnostics = runChecksFor({
      id: "workflow_routes_to_invalid",
      name: "Workflow Routes To Invalid",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Produce output.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop when done."
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
      links: [
        { id: "bad_route_source", kind: "routes_to", from: "role_1", to: "gate_1" },
        { id: "bad_route_target", kind: "routes_to", from: "step_1", to: "artifact_1" }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.link.routes_to_source_invalid",
      "check.link.routes_to_target_invalid"
    ]);
  });

  it("fails overlapping support inputs, interim outputs, and invalid next-step targets", () => {
    const diagnostics = runChecksFor({
      id: "workflow_overlap",
      name: "Workflow Overlap",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Produce output.",
          requiredInputIds: ["artifact_1"],
          supportInputIds: ["artifact_1"],
          interimArtifactIds: ["artifact_1"],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop when done.",
          nextStepId: "gate_1"
        }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.workflow.input_support_overlap",
      "check.workflow.interim_output_overlap",
      "check.workflow.invalid_next_step_target"
    ]);
  });
});
