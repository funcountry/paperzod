import { describe, expect, it } from "vitest";

import type { SetupDef } from "../../src/core/index.js";
import { buildGraph } from "../../src/graph/index.js";
import { normalizeSetup } from "../../src/source/index.js";
import demoMinimalSeed from "../fixtures/source/demo-minimal.js";

function requireNormalizedSetup(input: unknown): SetupDef {
  const result = normalizeSetup(input);
  expect(result.success).toBe(true);
  if (!result.success) {
    throw new Error("Expected setup normalization to succeed.");
  }

  return result.data;
}

describe("graph linker", () => {
  it("resolves a valid setup into a DoctrineGraph", () => {
    const setup = requireNormalizedSetup(demoMinimalSeed);
    const result = buildGraph(setup);

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect({
      setupId: result.data.setup.id,
      nodeIds: Object.keys(result.data.nodeById).sort(),
      linkIds: Object.keys(result.data.linkById).sort(),
      outgoingFromDraftPacket: result.data.outgoingLinkIdsByNodeId.draft_packet,
      incomingToPacket: result.data.incomingLinkIdsByNodeId.packet_v1
    }).toMatchInlineSnapshot(`
      {
        "incomingToPacket": [
          "step_produces_packet",
          "gate_checks_packet",
        ],
        "linkIds": [
          "author_home_documents_author",
          "gate_checks_packet",
          "role_contract_documents_author",
          "step_produces_packet",
          "step_supports_notes",
          "workflow_section_documents_step",
        ],
        "nodeIds": [
          "author",
          "author_home",
          "author_home_target",
          "critic",
          "critic_gate",
          "draft_notes",
          "draft_packet",
          "packet_contract",
          "packet_v1",
          "research_notes",
          "role_contract",
          "workflow_section",
          "workflow_surface",
          "workflow_target",
        ],
        "outgoingFromDraftPacket": [
          "step_supports_notes",
          "step_produces_packet",
        ],
        "setupId": "demo_minimal",
      }
    `);
  });

  it("rejects duplicate node ids within a setup", () => {
    const setup = requireNormalizedSetup({
      id: "duplicate_ids",
      name: "Duplicate Ids",
      roles: [{ id: "shared_id", name: "Role", purpose: "Do work." }],
      artifacts: [{ id: "shared_id", name: "Artifact", artifactClass: "required" }]
    });

    const result = buildGraph(setup);

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["graph.duplicate_node_id"]);
  });

  it("rejects broken link sources", () => {
    const setup = requireNormalizedSetup(demoMinimalSeed);
    const result = buildGraph({
      ...setup,
      links: [{ id: "broken_from", setupId: setup.setup.id, kind: "supports", from: "missing_step", to: "packet_v1" }]
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["graph.unknown_link_source"]);
  });

  it("rejects broken link targets", () => {
    const setup = requireNormalizedSetup(demoMinimalSeed);
    const result = buildGraph({
      ...setup,
      links: [{ id: "broken_to", setupId: setup.setup.id, kind: "produces", from: "draft_packet", to: "missing_artifact" }]
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["graph.unknown_link_target"]);
  });
});
