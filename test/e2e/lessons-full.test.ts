import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";
import lessonsFullSeed from "../fixtures/source/lessons-full.js";

function compile(input: unknown) {
  return compileSetup(
    input,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "paperclip_agents"
    })
  );
}

describe("lessons_full e2e", () => {
  it("compiles the full Lessons proving fixture with stable manifest, traces, and markdown", () => {
    const result = compile(lessonsFullSeed);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    const sectionTraces = result.data.plan.sections
      .filter((section) =>
        [
          "workflow_comment_shape",
          "workflow_specialist_turn_shape",
          "section_dossier_lane_contract",
          "lesson_architect_lane_contract",
          "gate_what_critic_judges"
        ].includes(section.id)
      )
      .map((section) => ({
        id: section.id,
        documentId: section.documentId,
        title: section.title,
        sourceIds: section.sourceIds
      }));

    expect({
      manifest: result.data.manifest,
      exactDependencies: {
        roleReads: result.data.graph.indexes.readSectionIdsByReaderId.section_dossier_engineer,
        lessonStepReads: result.data.graph.indexes.readSectionIdsByReaderId.lesson_architect_step,
        gateReads: result.data.graph.indexes.readSectionIdsByReaderId.lessons_acceptance_critic_gate,
        gateChecks: result.data.graph.indexes.checkedNodeIdsByCheckerId.lessons_acceptance_critic_gate,
        sectionOwners: {
          dossier_role_contract: result.data.graph.indexes.ownerIdsByNodeId.dossier_role_contract,
          lesson_architect_lane_contract: result.data.graph.indexes.ownerIdsByNodeId.lesson_architect_lane_contract,
          gate_what_critic_judges: result.data.graph.indexes.ownerIdsByNodeId.gate_what_critic_judges
        }
      },
      sectionTraces,
      rendered: Object.fromEntries(result.data.documents.map((document) => [document.id, document.markdown]))
    }).toMatchSnapshot();
  });

  it("fails loudly on standards, gate, and runtime-mapping drift", () => {
    const standardsDrift = compile({
      ...lessonsFullSeed,
      links: lessonsFullSeed.links.map((link) =>
        link.id === "packet_shape_section_documents_artifact" ? { ...link, to: "missing_standard_artifact" } : link
      )
    });
    expect(standardsDrift.success).toBe(false);
    if (!standardsDrift.success) {
      expect(standardsDrift.diagnostics.map((diagnostic) => diagnostic.code)).toContain("graph.unknown_link_target");
    }

    const gateDrift = compile({
      ...lessonsFullSeed,
      reviewGates: lessonsFullSeed.reviewGates.map((gate) =>
        gate.id === "lessons_acceptance_critic_gate" ? { ...gate, checkIds: ["missing_packet"] } : gate
      )
    });
    expect(gateDrift.success).toBe(false);
    if (!gateDrift.success) {
      expect(gateDrift.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.review_gate.invalid_check_target");
    }

    const mappingDrift = compile({
      ...lessonsFullSeed,
      packetContracts: lessonsFullSeed.packetContracts.map((contract) =>
        contract.id === "lesson_plan_contract" ? { ...contract, runtimeArtifactIds: ["section_dossier_packet"] } : contract
      )
    });
    expect(mappingDrift.success).toBe(false);
    if (!mappingDrift.success) {
      expect(mappingDrift.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.packet.invalid_runtime_artifact");
    }
  });
});
