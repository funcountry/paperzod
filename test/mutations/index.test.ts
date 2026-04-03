import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";
import editorialSetup from "../../setups/editorial/index.ts";
import editorialVerticalSliceSeed from "../fixtures/source/editorial-vertical-slice.js";
import releaseOpsSetup from "../../setups/release_ops/index.ts";

const editorialSource = editorialSetup.setup;
const releaseOpsSource = releaseOpsSetup.setup;

function withEditorialSetup(patch: Partial<typeof editorialSource>) {
  return {
    ...editorialSetup,
    setup: {
      ...editorialSource,
      ...patch
    }
  };
}

function withReleaseOpsSetup(patch: Partial<typeof releaseOpsSource>) {
  return {
    ...releaseOpsSetup,
    setup: {
      ...releaseOpsSource,
      ...patch
    }
  };
}

function compile(input: unknown) {
  return compileSetup(
    input,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "."
    })
  );
}

const evidenceMutationSeed = {
  id: "evidence_mutation_seed",
  name: "Evidence Mutation Seed",
  registries: [
    {
      id: "publish_result",
      name: "Publish Result",
      entries: [
        { id: "pass", label: "PASS" },
        { id: "revise", label: "Revise" }
      ]
    }
  ],
  artifacts: [
    {
      id: "authority_note",
      name: "Authority Note",
      artifactClass: "required" as const,
      evidence: {
        requiredArtifactIds: ["review_receipt"],
        requiredClaims: [
          {
            id: "publish_decision",
            label: "Publish decision",
            allowedValue: {
              registryId: "publish_result",
              entryId: "pass"
            }
          }
        ]
      }
    },
    {
      id: "review_receipt",
      name: "Review Receipt",
      artifactClass: "support" as const
    }
  ]
};

describe("mutation suite", () => {
  it("catches packet rename drift", () => {
    const result = compile(withEditorialSetup({
      packetContracts: editorialSource.packetContracts.map((contract) =>
        contract.id === "editorial_brief_contract"
          ? { ...contract, conceptualArtifactIds: ["editorial_brief_packet_renamed"] }
          : contract
      )
    }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.packet.invalid_conceptual_artifact");
    }
  });

  it("keeps section renames localized", () => {
    const original = compile(editorialVerticalSliceSeed);
    const renamed = compile({
      ...editorialVerticalSliceSeed,
      surfaceSections: editorialVerticalSliceSeed.surfaceSections.map((section) =>
        section.id === "standard_comment_shape" ? { ...section, title: "Comment Pattern" } : section
      )
    });

    expect(original.success).toBe(true);
    expect(renamed.success).toBe(true);
    if (!original.success || !renamed.success) {
      return;
    }

    const changedIds = original.data.documents
      .filter((document, index) => document.markdown !== renamed.data.documents[index]?.markdown)
      .map((document) => document.id);

    expect(changedIds).toEqual(["packet_shapes_standard"]);
  });

  it("catches role-contract drift", () => {
    const result = compile(withReleaseOpsSetup({
      workflowSteps: releaseOpsSource.workflowSteps.map((step) =>
        step.id === "release_readiness_step" ? { ...step, roleId: "missing_role" } : step
      )
    }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.workflow.missing_role");
    }
  });

  it("catches gate-check drift", () => {
    const result = compile(withEditorialSetup({
      reviewGates: editorialSource.reviewGates.map((gate) =>
        gate.id === "editorial_acceptance_gate" ? { ...gate, checkIds: ["missing_packet"] } : gate
      )
    }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.review_gate.invalid_check_target");
    }
  });

  it("catches downstream consumer-or-gate drift", () => {
    const result = compile(withReleaseOpsSetup({
      reviewGates: releaseOpsSource.reviewGates.map((gate) =>
        gate.id === "release_readiness_gate" ? { ...gate, checkIds: ["release_protocol_standard"] } : gate
      )
    }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain(
        "check.workflow.output_missing_downstream_consumer"
      );
    }
  });

  it("catches compatibility-mapping drift", () => {
    const result = compile(withEditorialSetup({
      packetContracts: editorialSource.packetContracts.map((contract) =>
        contract.id === "story_outline_contract" ? { ...contract, runtimeArtifactIds: ["editorial_brief_packet"] } : contract
      )
    }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.packet.invalid_runtime_artifact");
    }
  });

  it("catches exact-section reads drift", () => {
    const result = compile(withEditorialSetup({
      links: editorialSource.links.map((link) =>
        link.id === "story_step_reads_quality_bar" ? { ...link, to: "missing_quality_bar_section" } : link
      )
    }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("graph.unknown_link_target");
    }
  });

  it("catches typed workflow-routing drift", () => {
    const result = compile({
      ...editorialVerticalSliceSeed,
      links: [
        ...editorialVerticalSliceSeed.links,
        { id: "bad_routes_to_source", kind: "routes_to", from: "brief_researcher", to: "workflow_lane_contract" },
        { id: "bad_routes_to_target", kind: "routes_to", from: "brief_research_step", to: "standard_comment_shape" }
      ]
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(
        expect.arrayContaining(["check.link.routes_to_source_invalid", "check.link.routes_to_target_invalid"])
      );
    }
  });

  it("catches orphaned-section drift", () => {
    const result = compile({
      ...editorialVerticalSliceSeed,
      links: editorialVerticalSliceSeed.links.filter(
        (link) => !["standard_comment_shape_documents_artifact", "role_reads_comment_shape"].includes(link.id)
      )
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.surface_section.orphaned");
    }
  });

  it("catches duplicate canonical-owner drift", () => {
    const result = compile({
      ...editorialVerticalSliceSeed,
      links: [
        ...editorialVerticalSliceSeed.links,
        { id: "workflow_lane_contract_owned_by_gate", kind: "owns", from: "editorial_acceptance_gate", to: "workflow_lane_contract" }
      ]
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.ownership.conflicting_owner");
    }
  });

  it("catches typed artifact-flow link drift", () => {
    const result = compile(withReleaseOpsSetup({
      links: [
        ...releaseOpsSource.links,
        { id: "bad_produces_target", kind: "produces", from: "release_readiness_step", to: "release_how_to_surface" },
        { id: "bad_consumes_source", kind: "consumes", from: "coordinator", to: "release_readiness_contract" },
        { id: "bad_supports_target", kind: "supports", from: "release_readiness_step", to: "shared_release_order" }
      ]
    }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(
        expect.arrayContaining([
          "check.link.produces_target_invalid",
          "check.link.consumes_source_invalid",
          "check.link.supports_target_invalid"
        ])
      );
    }
  });

  it("catches typed ownership and reference-link drift", () => {
    const result = compile(withEditorialSetup({
      links: [
        ...editorialSource.links,
        { id: "bad_owns_source", kind: "owns", from: "packet_shape_standard_artifact", to: "packet_shape_section" },
        { id: "bad_grounds_source", kind: "grounds", from: "editorial_brief_packet", to: "editorial_simple_clear_ref" },
        { id: "bad_references_source", kind: "references", from: "editorial_brief_packet", to: "audience_research_reference" }
      ]
    }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(
        expect.arrayContaining([
          "check.link.owns_source_invalid",
          "check.link.grounds_source_invalid",
          "check.link.references_source_invalid"
        ])
      );
    }
  });

  it("catches link-level maps_to_runtime drift", () => {
    const valid = withEditorialSetup({
      links: [
        ...editorialSource.links,
        {
          id: "story_outline_contract_maps_to_runtime_workflow",
          kind: "maps_to_runtime",
          from: "story_outline_contract",
          to: "story_architect_workflow"
        }
      ]
    });
    expect(compile(valid).success).toBe(true);

    const drift = compile({
      ...valid,
      setup: {
        ...valid.setup,
        links: valid.setup.links.map((link) =>
          link.id === "story_outline_contract_maps_to_runtime_workflow" ? { ...link, to: "comment_shape_contract" } : link
        )
      }
    });

    expect(drift.success).toBe(false);
    if (!drift.success) {
      expect(drift.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.link.maps_to_runtime_target_invalid");
    }
  });

  it("catches explicit generated_from provenance drift", () => {
    const result = compile({
      ...editorialVerticalSliceSeed,
      links: [
        ...editorialVerticalSliceSeed.links,
        { id: "bad_generated_from_source", kind: "generated_from", from: "brief_researcher", to: "role_contract" },
        { id: "bad_generated_from_target", kind: "generated_from", from: "brief_researcher_home_read_first_target", to: "brief_researcher_home" }
      ]
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(
        expect.arrayContaining(["plan.generated_from_source_invalid", "plan.generated_from_target_invalid"])
      );
    }
  });

  it("catches registry-backed evidence drift", () => {
    const result = compile({
      ...evidenceMutationSeed,
      artifacts: evidenceMutationSeed.artifacts.map((artifact) =>
        artifact.id === "authority_note"
          ? {
              ...artifact,
              evidence: {
                ...artifact.evidence,
                requiredClaims: artifact.evidence?.requiredClaims?.map((claim) =>
                  claim.id === "publish_decision"
                    ? {
                        ...claim,
                        allowedValue: {
                          registryId: "publish_result",
                          entryId: "missing_entry"
                        }
                      }
                    : claim
                )
              }
            }
          : artifact
      )
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.registry.unknown_allowed_value_entry");
    }
  });

  it("catches artifact-evidence dependency drift", () => {
    const result = compile({
      ...evidenceMutationSeed,
      artifacts: evidenceMutationSeed.artifacts.map((artifact) =>
        artifact.id === "authority_note"
          ? {
              ...artifact,
              evidence: {
                ...artifact.evidence,
                requiredArtifactIds: ["missing_receipt"]
              }
            }
          : artifact
      )
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.artifact_evidence.unknown_required_artifact");
    }
  });
});
