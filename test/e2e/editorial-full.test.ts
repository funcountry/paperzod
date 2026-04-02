import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";
import editorialSetup from "../../setups/editorial/index.ts";

const editorialSource = editorialSetup.setup;

function withEditorialSetup(patch: Partial<typeof editorialSource>) {
  return {
    ...editorialSetup,
    setup: {
      ...editorialSource,
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

describe("editorial_full e2e", () => {
  it("compiles the full Editorial proving fixture with stable manifest, traces, and markdown", () => {
    const result = compile(editorialSetup);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.manifest.documentPaths.editorial_project_home_root).toBe(
      "/repo/paperclip_home/project_homes/editorial/README.md"
    );

    for (const document of result.data.documents) {
      expect(document.markdown).not.toContain("Artifact class:");
      expect(document.markdown).not.toContain("Reference class:");
      expect(document.markdown).not.toContain("Conceptual only:");
      expect(document.markdown).not.toContain("Compatibility only:");
    }

    const sectionTraces = result.data.plan.sections
      .filter((section) =>
        [
          "project_home_map",
          "workflow_comment_shape",
          "workflow_specialist_turn_shape",
          "brief_researcher_lane_contract",
          "story_architect_lane_contract",
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
        roleReads: result.data.graph.indexes.readSectionIdsByReaderId.brief_researcher,
        lessonStepReads: result.data.graph.indexes.readSectionIdsByReaderId.story_architect_step,
        gateReads: result.data.graph.indexes.readSectionIdsByReaderId.editorial_acceptance_gate,
        gateChecks: result.data.graph.indexes.checkedNodeIdsByCheckerId.editorial_acceptance_gate,
        sectionOwners: {
          brief_researcher_role_contract: result.data.graph.indexes.ownerIdsByNodeId.brief_researcher_role_contract,
          story_architect_lane_contract: result.data.graph.indexes.ownerIdsByNodeId.story_architect_lane_contract,
          gate_what_critic_judges: result.data.graph.indexes.ownerIdsByNodeId.gate_what_critic_judges
        }
      },
      sectionTraces,
      rendered: Object.fromEntries(result.data.documents.map((document) => [document.id, document.markdown]))
    }).toMatchSnapshot();
  });

  it("fails loudly on standards, gate, and runtime-mapping drift", () => {
    const standardsDrift = compile(withEditorialSetup({
      links: editorialSource.links.map((link) =>
        link.kind === "documents" && link.from === "packet_shape_section" ? { ...link, to: "missing_standard_artifact" } : link
      )
    }));
    expect(standardsDrift.success).toBe(false);
    if (!standardsDrift.success) {
      expect(standardsDrift.diagnostics.map((diagnostic) => diagnostic.code)).toContain("graph.unknown_link_target");
    }

    const gateDrift = compile(withEditorialSetup({
      reviewGates: editorialSource.reviewGates.map((gate) =>
        gate.id === "editorial_acceptance_gate" ? { ...gate, checkIds: ["missing_packet"] } : gate
      )
    }));
    expect(gateDrift.success).toBe(false);
    if (!gateDrift.success) {
      expect(gateDrift.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.review_gate.invalid_check_target");
    }

    const mappingDrift = compile(withEditorialSetup({
      packetContracts: editorialSource.packetContracts.map((contract) =>
        contract.id === "story_outline_contract" ? { ...contract, runtimeArtifactIds: ["editorial_brief_packet"] } : contract
      )
    }));
    expect(mappingDrift.success).toBe(false);
    if (!mappingDrift.success) {
      expect(mappingDrift.diagnostics.map((diagnostic) => diagnostic.code)).toContain("check.packet.invalid_runtime_artifact");
    }
  });
});
