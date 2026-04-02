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
    expect(surfaceSchema.safeParse({ id: "surface_1", surfaceClass: "role_home", runtimePath: "generated/AGENTS.md" }).success).toBe(
      true
    );
    expect(surfaceSchema.safeParse({ id: "surface_1", surfaceClass: "bogus", runtimePath: "generated/AGENTS.md" }).success).toBe(
      false
    );
  });

  it("validates surface sections", () => {
    expect(surfaceSectionSchema.safeParse({ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }).success).toBe(
      true
    );
    expect(surfaceSectionSchema.safeParse({ id: "section_1", surfaceId: "surface_1", stableSlug: "Read First", title: "Read First" }).success).toBe(
      false
    );
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
