import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget, createTargetAdapter, emitDocuments } from "../../src/index.js";
import lessonsSetup from "../../setups/lessons/index.ts";
import demoMinimalSeed from "../fixtures/source/demo-minimal.js";
import { withTempDir } from "../helpers/fs.js";

function compileLessonsFull() {
  return compileSetup(
    lessonsSetup,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "paperclip_agents"
    })
  );
}

function requireEmitSuccess(result: Awaited<ReturnType<typeof emitDocuments>>) {
  expect(result.success).toBe(true);
  if (!result.success) {
    throw new Error(result.diagnostics.map((diagnostic) => diagnostic.code).join(", "));
  }

  return result.data;
}

describe("stability and diff locality", () => {
  it("produces byte-identical output on repeated compile", () => {
    const first = compileLessonsFull();
    const second = compileLessonsFull();

    expect(first).toEqual(second);
  });

  it("keeps diagnostic ordering deterministic", () => {
    const input = {
      ...demoMinimalSeed,
      workflowSteps: demoMinimalSeed.workflowSteps.map((step) => ({
        ...step,
        roleId: "missing_role",
        nextGateId: undefined
      }))
    };

    const first = compileSetup(
      input,
      createTargetAdapter({
        name: "test",
        repoRoot: "/repo",
        outputRoot: "out"
      })
    );
    const second = compileSetup(
      input,
      createTargetAdapter({
        name: "test",
        repoRoot: "/repo",
        outputRoot: "out"
      })
    );

    expect(first).toEqual(second);
    expect(first.success).toBe(false);
    if (!first.success) {
      expect(first.diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
        "check.workflow.missing_role",
        "check.workflow.missing_route"
      ]);
    }
  });

  it("does not rewrite unchanged files", async () => {
    await withTempDir(async (dir) => {
      const compiled = compileSetup(
        demoMinimalSeed,
        createTargetAdapter({
          name: "test",
          repoRoot: dir,
          outputRoot: "."
        })
      );

      expect(compiled.success).toBe(true);
      if (!compiled.success) {
        return;
      }

      const firstEmit = requireEmitSuccess(await emitDocuments(compiled.data.documents, compiled.data.manifest, { write: true }));
      const secondEmit = requireEmitSuccess(await emitDocuments(compiled.data.documents, compiled.data.manifest, { write: true }));

      expect(firstEmit.files.some((file) => file.status === "create")).toBe(true);
      expect(secondEmit.files.every((file) => file.status === "unchanged")).toBe(true);
    });
  });

  it("keeps source changes localized to one emitted diff", async () => {
    await withTempDir(async (dir) => {
      const original = compileSetup(
        demoMinimalSeed,
        createTargetAdapter({
          name: "test",
          repoRoot: dir,
          outputRoot: "."
        })
      );
      const changed = compileSetup(
        {
          ...demoMinimalSeed,
          roles: demoMinimalSeed.roles.map((role) =>
            role.id === "author" ? { ...role, purpose: "Create and tighten the artifact." } : role
          )
        },
        createTargetAdapter({
          name: "test",
          repoRoot: dir,
          outputRoot: "."
        })
      );

      expect(original.success).toBe(true);
      expect(changed.success).toBe(true);
      if (!original.success || !changed.success) {
        return;
      }

      requireEmitSuccess(await emitDocuments(original.data.documents, original.data.manifest, { write: true }));
      const diff = requireEmitSuccess(await emitDocuments(changed.data.documents, changed.data.manifest, { write: false }));

      expect(diff.files.map((file) => [file.documentId, file.status])).toEqual([
        ["author_home", "update"],
        ["workflow_surface", "unchanged"]
      ]);
    });
  });
});
