import { describe, expect, it } from "vitest";

import {
  artifactSchema,
  generatedTargetSchema,
  packetContractSchema,
  referenceSchema,
  reviewGateSchema,
  roleSchema,
  setupSchema,
  surfaceSchema,
  surfaceSectionSchema,
  workflowStepSchema
} from "../../src/source/schemas.js";

describe("source node schemas", () => {
  it("validates setup identity", () => {
    expect(setupSchema.safeParse({ id: "setup_1", name: "Setup 1" }).success).toBe(true);
    expect(setupSchema.safeParse({ id: "", name: "Setup 1" }).success).toBe(false);
  });

  it("validates roles", () => {
    expect(roleSchema.safeParse({ id: "role_1", name: "Role", purpose: "Do work." }).success).toBe(true);
    expect(roleSchema.safeParse({ id: "role_1", name: "", purpose: "Do work." }).success).toBe(false);
  });

  it("validates workflow steps", () => {
    expect(
      workflowStepSchema.safeParse({
        id: "step_1",
        roleId: "role_1",
        purpose: "Do work.",
        requiredInputIds: [],
        requiredOutputIds: ["artifact_1"],
        stopLine: "Stop.",
        nextGateId: "gate_1"
      }).success
    ).toBe(true);
    expect(
      workflowStepSchema.safeParse({
        id: "step_1",
        roleId: "role_1",
        purpose: "Do work.",
        requiredInputIds: [],
        requiredOutputIds: [],
        stopLine: "Stop.",
        nextGateId: "gate_1"
      }).success
    ).toBe(false);
  });

  it("validates review gates", () => {
    expect(reviewGateSchema.safeParse({ id: "gate_1", name: "Gate", purpose: "Check.", checkIds: ["artifact_1"] }).success).toBe(
      true
    );
    expect(reviewGateSchema.safeParse({ id: "gate_1", name: "Gate", purpose: "Check.", checkIds: [] }).success).toBe(false);
  });

  it("validates packet contracts", () => {
    expect(packetContractSchema.safeParse({ id: "contract_1", name: "Contract", conceptualArtifactIds: ["artifact_1"] }).success).toBe(
      true
    );
    expect(packetContractSchema.safeParse({ id: "contract_1", name: "Contract", conceptualArtifactIds: [] }).success).toBe(false);
  });

  it("validates artifacts", () => {
    expect(artifactSchema.safeParse({ id: "artifact_1", name: "Artifact", artifactClass: "required" }).success).toBe(true);
    expect(artifactSchema.safeParse({ id: "artifact_1", name: "Artifact", artifactClass: "bogus" }).success).toBe(false);
  });

  it("validates surfaces", () => {
    expect(
      surfaceSchema.safeParse({
        id: "surface_1",
        surfaceClass: "role_home",
        runtimePath: "generated/AGENTS.md",
        preamble: [
          { kind: "paragraph", text: "Start here." },
          {
            kind: "rule_list",
            items: [
              "Use the shared workflow owner.",
              { text: "Do not skip the quality bar.", children: ["Escalate if the quality bar is unclear."] }
            ]
          },
          {
            kind: "definition_list",
            items: [
              {
                term: "packet",
                definitions: ["The current handoff bundle.", { text: "Trust only what the current owner proved." }]
              }
            ]
          },
          {
            kind: "table",
            headers: ["Owner", "Reads"],
            rows: [["Lessons Project Lead", "shared/README.md"]]
          },
          {
            kind: "example",
            title: "Example command",
            blocks: [
              { kind: "paragraph", text: "Use this command when validating the setup." },
              { kind: "code_block", code: "paperzod doctor setups/lessons/setup.ts", language: "sh" }
            ]
          },
          {
            kind: "good_bad_examples",
            good: [
              {
                title: "Good prompt",
                blocks: [{ kind: "paragraph", text: "Ask what the next natural chapter should teach." }]
              }
            ],
            bad: [
              {
                title: "Bad prompt",
                blocks: [{ kind: "paragraph", text: "Rewrite my existing answer in nicer words." }]
              }
            ]
          }
        ]
      }).success
    ).toBe(true);
    expect(
      surfaceSchema.safeParse({ id: "surface_2", surfaceClass: "project_home_root", runtimePath: "generated/README.md" }).success
    ).toBe(true);
    expect(surfaceSchema.safeParse({ id: "surface_1", surfaceClass: "bogus", runtimePath: "generated/AGENTS.md" }).success).toBe(
      false
    );
  });

  it("validates surface sections", () => {
    expect(
      surfaceSectionSchema.safeParse({
        id: "section_1",
        surfaceId: "surface_1",
        stableSlug: "read-first",
        title: "Read First",
        body: [
          { kind: "paragraph", text: "Read this first." },
          {
            kind: "ordered_steps",
            items: ["Open the shared README.", { text: "Then read the owner map.", children: ["Only after that open lane doctrine."] }]
          },
          { kind: "code_block", code: "paperzod doctor setups/lessons/setup.ts", language: "sh" }
        ]
      }).success
    ).toBe(true);
    expect(
      surfaceSectionSchema.safeParse({
        id: "section_2",
        surfaceId: "surface_1",
        stableSlug: "workflow-items",
        title: "Workflow Items",
        parentSectionId: "section_1"
      }).success
    ).toBe(true);
    expect(surfaceSectionSchema.safeParse({ id: "section_1", surfaceId: "surface_1", stableSlug: "Read First", title: "Read First" }).success).toBe(
      false
    );
    expect(
      surfaceSectionSchema.safeParse({
        id: "section_1",
        surfaceId: "surface_1",
        stableSlug: "read-first",
        title: "Read First",
        parentSectionId: "section_1"
      }).success
    ).toBe(false);
  });

  it("rejects malformed authored tables", () => {
    expect(
      surfaceSectionSchema.safeParse({
        id: "section_2",
        surfaceId: "surface_1",
        stableSlug: "owner-map",
        title: "Owner Map",
        body: [
          {
            kind: "table",
            headers: ["Owner", "Reads"],
            rows: [["Lessons Project Lead"]]
          }
        ]
      }).success
    ).toBe(false);
  });

  it("validates references", () => {
    expect(referenceSchema.safeParse({ id: "ref_1", referenceClass: "imported_reference", name: "Imported Ref" }).success).toBe(true);
    expect(referenceSchema.safeParse({ id: "ref_1", referenceClass: "external_reference", name: "External", url: "not-a-url" }).success).toBe(
      false
    );
  });

  it("validates generated targets", () => {
    expect(
      generatedTargetSchema.safeParse({ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["step_1"], sectionId: "section_1" }).success
    ).toBe(true);
    expect(generatedTargetSchema.safeParse({ id: "target_1", path: "", sourceIds: [] }).success).toBe(false);
  });
});
