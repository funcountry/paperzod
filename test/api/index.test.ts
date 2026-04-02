import { describe, expect, it } from "vitest";

import { buildGraph, compileAndEmitSetup, compileSetup, createTargetAdapter, renderSetup, validateSetup } from "../../src/index.js";
import editorialExample from "../fixtures/source/editorial-example.js";
import demoMinimalSeed from "../fixtures/source/demo-minimal.js";
import { withTempDir } from "../helpers/fs.js";

describe("public library api", () => {
  it("validates and normalizes a setup", () => {
    const result = validateSetup(demoMinimalSeed);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.setup.id).toBe("demo_minimal");
  });

  it("builds a graph from normalized source", () => {
    const validated = validateSetup(demoMinimalSeed);
    expect(validated.success).toBe(true);
    if (!validated.success) {
      return;
    }

    const graph = buildGraph(validated.data);
    expect(graph.success).toBe(true);
  });

  it("renders a setup end to end", () => {
    const rendered = renderSetup({
      id: "api_render",
      name: "API Render",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Emit output.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop when complete.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
      surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
      generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["step_1"], sectionId: "section_1" }],
      links: [{ id: "documents_1", kind: "documents", from: "section_1", to: "step_1" }]
    });

    expect(rendered.success).toBe(true);
    if (!rendered.success) {
      return;
    }

    expect(rendered.data.documents[0]?.markdown).toContain("# Workflow Owner");
  });

  it("compiles a setup through planning, rendering, and target resolution", () => {
    const compiled = compileSetup(
      {
        id: "api_compile",
        name: "API Compile",
        roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
        workflowSteps: [
          {
            id: "step_1",
            roleId: "role_1",
            purpose: "Emit output.",
            requiredInputIds: [],
            requiredOutputIds: ["artifact_1"],
            stopLine: "Stop when complete.",
            nextGateId: "gate_1"
          }
        ],
        reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
        artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
        surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
        surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
        generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["step_1"], sectionId: "section_1" }],
        links: [{ id: "documents_1", kind: "documents", from: "section_1", to: "step_1" }]
      },
      createTargetAdapter({ name: "test", repoRoot: "/repo", outputRoot: "out" })
    );

    expect(compiled.success).toBe(true);
    if (!compiled.success) {
      return;
    }

    expect(compiled.data.manifest.documentPaths.surface_1).toBe("/repo/out/generated/WORKFLOW.md");
    expect(compiled.data.rendered.documents[0]?.markdown).toContain("# Workflow Owner");
  });

  it("can compile and emit through the public api", async () => {
    await withTempDir(async (dir) => {
      const compiled = await compileAndEmitSetup(
        {
          id: "api_compile_emit",
          name: "API Compile Emit",
          roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
          workflowSteps: [
            {
              id: "step_1",
              roleId: "role_1",
              purpose: "Emit output.",
              requiredInputIds: [],
              requiredOutputIds: ["artifact_1"],
              stopLine: "Stop when complete.",
              nextGateId: "gate_1"
            }
          ],
          reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
          artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
          surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
          surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
          generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["step_1"], sectionId: "section_1" }],
          links: [{ id: "documents_1", kind: "documents", from: "section_1", to: "step_1" }]
        },
        createTargetAdapter({ name: "test", repoRoot: dir, outputRoot: "." }),
        { write: true }
      );

      expect(compiled.success).toBe(true);
      if (!compiled.success) {
        return;
      }

      expect(compiled.data.emit.files.map((file) => file.status)).toEqual(["create"]);
      expect(compiled.data.manifest.documentPaths.surface_1).toContain("generated/WORKFLOW.md");
    });
  });

  it("compiles a helper-backed setup through the public api", () => {
    const compiled = compileSetup(
      editorialExample,
      createTargetAdapter({ name: "test", repoRoot: "/repo", outputRoot: "out" })
    );

    expect(compiled.success).toBe(true);
    if (!compiled.success) {
      return;
    }

    expect(compiled.data.manifest.documentPaths.editorial_workflow).toBe(
      "/repo/out/generated/editorial/shared/AUTHORITATIVE_WORKFLOW.md"
    );
    expect(compiled.data.rendered.documents.find((document) => document.id === "editorial_workflow")?.markdown).toContain(
      "Move one issue from draft to publish in a fixed order."
    );
  });
});
