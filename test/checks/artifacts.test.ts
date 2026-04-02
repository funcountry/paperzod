import { describe, expect, it } from "vitest";

import { runChecks } from "../../src/checks/index.js";
import { buildGraph } from "../../src/graph/index.js";
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

describe("artifact and packet checks", () => {
  it("accepts valid trust and packet semantics for the demo fixture", () => {
    expect(runChecksFor(demoMinimalSeed)).toEqual([]);
  });

  it("accepts packet-contract gate checks and valid runtime mapping links", () => {
    expect(
      runChecksFor({
        id: "artifact_packet_gate_valid",
        name: "Artifact Packet Gate Valid",
        roles: [{ id: "author", name: "Author", purpose: "Produce the packet." }],
        workflowSteps: [
          {
            id: "step_1",
            roleId: "author",
            purpose: "Emit the packet artifact.",
            requiredInputIds: [],
            requiredOutputIds: ["packet_artifact"],
            stopLine: "Stop once the packet exists.",
            nextGateId: "gate_1"
          }
        ],
        reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check packet contract.", checkIds: ["packet_contract"] }],
        packetContracts: [{ id: "packet_contract", name: "Packet Contract", conceptualArtifactIds: ["packet_artifact"] }],
        artifacts: [
          { id: "packet_artifact", name: "PACKET.md", artifactClass: "required" },
          {
            id: "packet_runtime",
            name: "PACKET_RUNTIME.md",
            artifactClass: "legacy",
            runtimePath: "generated/PACKET_RUNTIME.md",
            compatibilityOnly: true
          }
        ],
        links: [{ id: "packet_maps_to_runtime", kind: "maps_to_runtime", from: "packet_contract", to: "packet_runtime" }]
      })
    ).toEqual([]);
  });

  it("rejects untrusted required inputs", () => {
    const diagnostics = runChecksFor({
      id: "artifact_untrusted_input",
      name: "Artifact Untrusted Input",
      roles: [
        { id: "author", name: "Author", purpose: "Produce the support note." },
        { id: "consumer", name: "Consumer", purpose: "Consume the packet." }
      ],
      artifacts: [
        { id: "support_note", name: "Support Note", artifactClass: "support" },
        { id: "packet_2", name: "Packet 2", artifactClass: "required" }
      ],
      workflowSteps: [
        {
          id: "consume_support",
          roleId: "consumer",
          purpose: "Incorrectly trust the support note.",
          requiredInputIds: ["support_note"],
          requiredOutputIds: ["packet_2"],
          stopLine: "Stop after the output exists.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check the packet.", checkIds: ["packet_2"] }]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["check.artifact.untrusted_required_input"]);
  });

  it("rejects dishonest conceptual and runtime mappings", () => {
    const diagnostics = runChecksFor({
      id: "artifact_mapping_conflicts",
      name: "Artifact Mapping Conflicts",
      roles: [{ id: "author", name: "Author", purpose: "Author the packet." }],
      artifacts: [
        {
          id: "conceptual_conflict",
          name: "Conceptual Conflict",
          artifactClass: "required",
          conceptualOnly: true,
          runtimePath: "generated/CONFLICT.md"
        },
        {
          id: "runtime_missing_path",
          name: "Runtime Missing Path",
          artifactClass: "required",
          compatibilityOnly: true
        },
        {
          id: "runtime_legacy",
          name: "Runtime Legacy",
          artifactClass: "legacy",
          runtimePath: "generated/RUNTIME.md",
          compatibilityOnly: true
        },
        { id: "conceptual_packet", name: "Conceptual Packet", artifactClass: "required" }
      ],
      packetContracts: [
        {
          id: "packet_contract",
          name: "Packet Contract",
          conceptualArtifactIds: ["runtime_legacy"],
          runtimeArtifactIds: ["conceptual_packet"]
        }
      ],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "author",
          purpose: "Emit the conceptual packet.",
          requiredInputIds: [],
          requiredOutputIds: ["conceptual_packet"],
          stopLine: "Stop after the packet exists.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check packet.", checkIds: ["conceptual_packet"] }]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.artifact.compatibility_requires_runtime",
      "check.artifact.conceptual_has_runtime",
      "check.packet.invalid_conceptual_artifact",
      "check.packet.invalid_runtime_artifact"
    ]);
  });

  it("rejects invalid gate check targets", () => {
    const diagnostics = runChecksFor({
      id: "artifact_gate_checks",
      name: "Artifact Gate Checks",
      references: [{ id: "ref_1", referenceClass: "support_reference", name: "Ref 1", sourcePath: "docs/ref/REF.md" }],
      reviewGates: [
        {
          id: "gate_1",
          name: "Gate 1",
          purpose: "Check output.",
          checkIds: ["ref_1"]
        }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["check.review_gate.invalid_check_target"]);
  });

  it("rejects invalid maps_to_runtime links", () => {
    const diagnostics = runChecksFor({
      id: "artifact_runtime_map_invalid",
      name: "Artifact Runtime Map Invalid",
      roles: [{ id: "author", name: "Author", purpose: "Author packet." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "author",
          purpose: "Produce packet artifact.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop once the artifact exists.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check packet.", checkIds: ["artifact_1"] }],
      packetContracts: [{ id: "packet_contract", name: "Packet Contract", conceptualArtifactIds: ["artifact_1"] }],
      artifacts: [
        { id: "artifact_1", name: "Artifact 1", artifactClass: "required" },
        { id: "artifact_2", name: "Artifact 2", artifactClass: "required" }
      ],
      links: [
        { id: "invalid_source", kind: "maps_to_runtime", from: "author", to: "artifact_2" },
        { id: "invalid_target", kind: "maps_to_runtime", from: "packet_contract", to: "artifact_1" }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.link.maps_to_runtime_source_invalid",
      "check.link.maps_to_runtime_target_invalid",
      "check.link.maps_to_runtime_target_invalid"
    ]);
  });

  it("rejects required outputs with no downstream consumer or gate", () => {
    const diagnostics = runChecksFor({
      id: "artifact_missing_downstream",
      name: "Artifact Missing Downstream",
      roles: [{ id: "author", name: "Author", purpose: "Author packet." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "author",
          purpose: "Produce packet artifact.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop once the artifact exists.",
          nextStepId: "step_2"
        },
        {
          id: "step_2",
          roleId: "author",
          purpose: "Do unrelated follow-up.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_2"],
          stopLine: "Stop once the second artifact exists.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check follow-up.", checkIds: ["artifact_2"] }],
      artifacts: [
        { id: "artifact_1", name: "Artifact 1", artifactClass: "required" },
        { id: "artifact_2", name: "Artifact 2", artifactClass: "required" }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["check.workflow.output_missing_downstream_consumer"]);
  });

  it("rejects invalid produces, consumes, and supports links", () => {
    const diagnostics = runChecksFor({
      id: "artifact_link_conflicts",
      name: "Artifact Link Conflicts",
      roles: [{ id: "author", name: "Author", purpose: "Author packet." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "author",
          purpose: "Produce packet artifact.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop once the artifact exists.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check packet.", checkIds: ["artifact_1"] }],
      packetContracts: [{ id: "packet_contract", name: "Packet Contract", conceptualArtifactIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
      references: [{ id: "ref_1", referenceClass: "support_reference", name: "Ref 1", sourcePath: "docs/ref/REF.md" }],
      links: [
        { id: "produces_bad_source", kind: "produces", from: "author", to: "artifact_1" },
        { id: "produces_bad_target", kind: "produces", from: "step_1", to: "ref_1" },
        { id: "consumes_bad_source", kind: "consumes", from: "gate_1", to: "packet_contract" },
        { id: "consumes_bad_target", kind: "consumes", from: "step_1", to: "ref_1" },
        { id: "supports_bad_source", kind: "supports", from: "author", to: "ref_1" },
        { id: "supports_bad_target", kind: "supports", from: "step_1", to: "packet_contract" }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.link.consumes_source_invalid",
      "check.link.consumes_target_invalid",
      "check.link.produces_source_invalid",
      "check.link.produces_target_invalid",
      "check.link.supports_source_invalid",
      "check.link.supports_target_invalid"
    ]);
  });
});
