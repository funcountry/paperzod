import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";
import lessonsSetup from "../../setups/lessons/index.ts";
import lessonsVerticalSliceSeed from "../fixtures/source/lessons-vertical-slice.js";
import coreDevSetup from "../../setups/core_dev/index.ts";

function compile(input: unknown) {
  return compileSetup(
    input,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "paperclip_agents"
    })
  );
}

describe("mutation suite", () => {
  it("catches packet rename drift", () => {
    const result = compile({
      ...lessonsSetup,
      packetContracts: lessonsSetup.packetContracts.map((contract) =>
        contract.id === "section_dossier_contract"
          ? { ...contract, conceptualArtifactIds: ["section_dossier_packet_renamed"] }
          : contract
      )
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.packet.invalid_conceptual_artifact");
    }
  });

  it("keeps section renames localized", () => {
    const original = compile(lessonsVerticalSliceSeed);
    const renamed = compile({
      ...lessonsVerticalSliceSeed,
      surfaceSections: lessonsVerticalSliceSeed.surfaceSections.map((section) =>
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
    const result = compile({
      ...coreDevSetup,
      workflowSteps: coreDevSetup.workflowSteps.map((step) =>
        step.id === "release_readiness_step" ? { ...step, roleId: "missing_role" } : step
      )
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.workflow.missing_role");
    }
  });

  it("catches gate-check drift", () => {
    const result = compile({
      ...lessonsSetup,
      reviewGates: lessonsSetup.reviewGates.map((gate) =>
        gate.id === "lessons_acceptance_critic_gate" ? { ...gate, checkIds: ["missing_packet"] } : gate
      )
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.review_gate.invalid_check_target");
    }
  });

  it("catches downstream consumer-or-gate drift", () => {
    const result = compile({
      ...coreDevSetup,
      reviewGates: coreDevSetup.reviewGates.map((gate) =>
        gate.id === "release_readiness_gate" ? { ...gate, checkIds: ["release_protocol_standard"] } : gate
      )
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain(
        "check.workflow.output_missing_downstream_consumer"
      );
    }
  });

  it("catches compatibility-mapping drift", () => {
    const result = compile({
      ...lessonsSetup,
      packetContracts: lessonsSetup.packetContracts.map((contract) =>
        contract.id === "lesson_plan_contract" ? { ...contract, runtimeArtifactIds: ["section_dossier_packet"] } : contract
      )
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.packet.invalid_runtime_artifact");
    }
  });

  it("catches exact-section reads drift", () => {
    const result = compile({
      ...lessonsSetup,
      links: lessonsSetup.links.map((link) =>
        link.id === "lesson_step_reads_quality_bar" ? { ...link, to: "missing_quality_bar_section" } : link
      )
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("graph.unknown_link_target");
    }
  });

  it("catches typed workflow-routing drift", () => {
    const result = compile({
      ...lessonsVerticalSliceSeed,
      links: [
        ...lessonsVerticalSliceSeed.links,
        { id: "bad_routes_to_source", kind: "routes_to", from: "section_dossier_engineer", to: "workflow_lane_contract" },
        { id: "bad_routes_to_target", kind: "routes_to", from: "section_dossier_step", to: "standard_comment_shape" }
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
      ...lessonsVerticalSliceSeed,
      links: lessonsVerticalSliceSeed.links.filter(
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
      ...lessonsVerticalSliceSeed,
      links: [
        ...lessonsVerticalSliceSeed.links,
        { id: "workflow_lane_contract_owned_by_gate", kind: "owns", from: "lessons_acceptance_critic_gate", to: "workflow_lane_contract" }
      ]
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.ownership.conflicting_owner");
    }
  });

  it("catches typed artifact-flow link drift", () => {
    const result = compile({
      ...coreDevSetup,
      links: [
        ...coreDevSetup.links,
        { id: "bad_produces_target", kind: "produces", from: "release_readiness_step", to: "release_how_to_surface" },
        { id: "bad_consumes_source", kind: "consumes", from: "shared_role", to: "release_readiness_contract" },
        { id: "bad_supports_target", kind: "supports", from: "release_readiness_step", to: "shared_release_order" }
      ]
    });

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
    const result = compile({
      ...lessonsSetup,
      links: [
        ...lessonsSetup.links,
        { id: "bad_owns_source", kind: "owns", from: "packet_shape_standard_artifact", to: "packet_shape_section" },
        { id: "bad_grounds_source", kind: "grounds", from: "section_dossier_packet", to: "lessons_simple_clear_ref" },
        { id: "bad_references_source", kind: "references", from: "section_dossier_packet", to: "poker_kb_reference" }
      ]
    });

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
    const valid = {
      ...lessonsSetup,
      links: [
        ...lessonsSetup.links,
        {
          id: "lesson_plan_contract_maps_to_runtime_workflow",
          kind: "maps_to_runtime",
          from: "lesson_plan_contract",
          to: "lesson_architect_workflow"
        }
      ]
    };
    expect(compile(valid).success).toBe(true);

    const drift = compile({
      ...valid,
      links: valid.links.map((link) =>
        link.id === "lesson_plan_contract_maps_to_runtime_workflow" ? { ...link, to: "comment_shape_contract" } : link
      )
    });

    expect(drift.success).toBe(false);
    if (!drift.success) {
      expect(drift.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.link.maps_to_runtime_target_invalid");
    }
  });

  it("catches explicit generated_from provenance drift", () => {
    const result = compile({
      ...lessonsVerticalSliceSeed,
      links: [
        ...lessonsVerticalSliceSeed.links,
        { id: "bad_generated_from_source", kind: "generated_from", from: "section_dossier_engineer", to: "role_contract" },
        { id: "bad_generated_from_target", kind: "generated_from", from: "dossier_role_home_read_first_target", to: "dossier_role_home" }
      ]
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(
        expect.arrayContaining(["plan.generated_from_source_invalid", "plan.generated_from_target_invalid"])
      );
    }
  });
});
