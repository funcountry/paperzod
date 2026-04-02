import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { emitDocuments } from "../../src/emit/index.js";
import { createTargetAdapter, resolveTargetManifest } from "../../src/plan/index.js";
import { renderSetup } from "../../src/index.js";
import { withTempDir } from "../helpers/fs.js";

function compileToRendered(input: unknown) {
  const rendered = renderSetup(input);
  expect(rendered.success).toBe(true);
  if (!rendered.success) {
    throw new Error("Expected checked render pipeline to succeed.");
  }

  return {
    plan: rendered.data.plan,
    rendered: rendered.data.documents
  };
}

function requireEmitSuccess(result: Awaited<ReturnType<typeof emitDocuments>>) {
  expect(result.success).toBe(true);
  if (!result.success) {
    throw new Error(result.diagnostics.map((diagnostic) => diagnostic.code).join(", "));
  }

  return result.data;
}

describe("emit layer", () => {
  it("detects manual edits and overwrites them only in write mode", async () => {
    await withTempDir(async (dir) => {
      const compiled = compileToRendered({
        id: "emit_manual_edit",
        name: "Emit Manual Edit",
        roles: [{ id: "role_1", name: "Role 1", purpose: "Own the generated workflow surface." }],
        surfaces: [{ id: "surface_1", surfaceClass: "role_home", runtimePath: "generated/WORKFLOW.md" }],
        surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
        generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["role_1"], sectionId: "section_1" }],
        links: [
          { id: "surface_documents_role", kind: "documents", from: "surface_1", to: "role_1" },
          { id: "section_documents_role", kind: "documents", from: "section_1", to: "role_1" }
        ]
      });

      const manifest = resolveTargetManifest(
        compiled.plan,
        createTargetAdapter({ name: "test", repoRoot: dir, outputRoot: "." })
      );
      expect(manifest.success).toBe(true);
      if (!manifest.success) {
        return;
      }

      const firstEmit = requireEmitSuccess(await emitDocuments(compiled.rendered, manifest.data, { write: true }));
      expect(firstEmit.files.map((file) => file.status)).toEqual(["create"]);

      const workflowPath = manifest.data.documentPaths.surface_1;
      expect(workflowPath).toBeDefined();
      if (!workflowPath) {
        return;
      }

      await writeFile(workflowPath, "# Manual edit\n", "utf8");

      const dryRun = requireEmitSuccess(await emitDocuments(compiled.rendered, manifest.data, { write: false }));
      expect(dryRun.files[0]?.status).toBe("update");
      expect(dryRun.files[0]?.diff).toContain("Manual edit");

      const overwrite = requireEmitSuccess(await emitDocuments(compiled.rendered, manifest.data, { write: true }));
      expect(overwrite.files[0]?.status).toBe("update");
      expect(await readFile(workflowPath, "utf8")).toBe(compiled.rendered[0]?.markdown);
    });
  });

  it("keeps diffs localized when one rendered document changes", async () => {
    await withTempDir(async (dir) => {
      const initial = compileToRendered({
        id: "emit_localized",
        name: "Emit Localized",
        roles: [{ id: "author", name: "Author", purpose: "Draft the packet." }],
        references: [
          {
            id: "shared_reference",
            referenceClass: "support_reference",
            name: "Shared Overview",
            sourcePath: "docs/ref/SHARED_OVERVIEW.md"
          }
        ],
        surfaces: [
          { id: "author_home", surfaceClass: "role_home", runtimePath: "generated/roles/author/AGENTS.md" },
          { id: "shared_readme", surfaceClass: "shared_entrypoint", runtimePath: "generated/shared/README.md" }
        ],
        surfaceSections: [
          { id: "role_section", surfaceId: "author_home", stableSlug: "read-first", title: "Read First" },
          { id: "shared_section", surfaceId: "shared_readme", stableSlug: "overview", title: "Overview" }
        ],
        generatedTargets: [
          { id: "target_role", path: "generated/roles/author/AGENTS.md", sourceIds: ["author"], sectionId: "role_section" },
          { id: "target_shared", path: "generated/shared/README.md", sourceIds: ["shared_reference"], sectionId: "shared_section" }
        ],
        links: [
          { id: "documents_role_surface", kind: "documents", from: "author_home", to: "author" },
          { id: "documents_role_section", kind: "documents", from: "role_section", to: "author" },
          { id: "documents_shared_surface", kind: "documents", from: "shared_readme", to: "shared_reference" },
          { id: "documents_shared_section", kind: "documents", from: "shared_section", to: "shared_reference" }
        ]
      });

      const changed = compileToRendered({
        id: "emit_localized",
        name: "Emit Localized",
        roles: [{ id: "author", name: "Author", purpose: "Draft and tighten the packet." }],
        references: [
          {
            id: "shared_reference",
            referenceClass: "support_reference",
            name: "Shared Overview",
            sourcePath: "docs/ref/SHARED_OVERVIEW.md"
          }
        ],
        surfaces: [
          { id: "author_home", surfaceClass: "role_home", runtimePath: "generated/roles/author/AGENTS.md" },
          { id: "shared_readme", surfaceClass: "shared_entrypoint", runtimePath: "generated/shared/README.md" }
        ],
        surfaceSections: [
          { id: "role_section", surfaceId: "author_home", stableSlug: "read-first", title: "Read First" },
          { id: "shared_section", surfaceId: "shared_readme", stableSlug: "overview", title: "Overview" }
        ],
        generatedTargets: [
          { id: "target_role", path: "generated/roles/author/AGENTS.md", sourceIds: ["author"], sectionId: "role_section" },
          { id: "target_shared", path: "generated/shared/README.md", sourceIds: ["shared_reference"], sectionId: "shared_section" }
        ],
        links: [
          { id: "documents_role_surface", kind: "documents", from: "author_home", to: "author" },
          { id: "documents_role_section", kind: "documents", from: "role_section", to: "author" },
          { id: "documents_shared_surface", kind: "documents", from: "shared_readme", to: "shared_reference" },
          { id: "documents_shared_section", kind: "documents", from: "shared_section", to: "shared_reference" }
        ]
      });

      const manifest = resolveTargetManifest(
        initial.plan,
        createTargetAdapter({ name: "test", repoRoot: dir, outputRoot: "." })
      );
      expect(manifest.success).toBe(true);
      if (!manifest.success) {
        return;
      }

      requireEmitSuccess(await emitDocuments(initial.rendered, manifest.data, { write: true }));
      const diff = requireEmitSuccess(await emitDocuments(changed.rendered, manifest.data, { write: false }));

      expect(diff.files.map((file) => [file.documentId, file.status])).toEqual([
        ["author_home", "update"],
        ["shared_readme", "unchanged"]
      ]);
    });
  });

  it("previews stale owned files and only applies deletes with explicit prune", async () => {
    await withTempDir(async (dir) => {
      const compiled = compileToRendered({
        id: "emit_owned_scope",
        name: "Emit Owned Scope",
        surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
        generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["surface_1"] }]
      });

      const manifest = resolveTargetManifest(
        compiled.plan,
        createTargetAdapter({ name: "test", repoRoot: dir, outputRoot: "." }),
        [{ kind: "root", path: "generated" }]
      );
      expect(manifest.success).toBe(true);
      if (!manifest.success) {
        return;
      }

      const workflowPath = manifest.data.documentPaths.surface_1;
      expect(workflowPath).toBeDefined();
      if (!workflowPath) {
        return;
      }

      requireEmitSuccess(await emitDocuments(compiled.rendered, manifest.data, { write: true }));

      const stalePath = path.join(dir, "generated", "STALE.md");
      await mkdir(path.dirname(stalePath), { recursive: true });
      await writeFile(stalePath, "# stale\n", "utf8");
      await writeFile(workflowPath, "# Manual edit\n", "utf8");

      const dryRun = requireEmitSuccess(await emitDocuments(compiled.rendered, manifest.data, { write: false }));
      expect(dryRun.files).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ documentId: "surface_1", status: "update", path: workflowPath }),
          expect.objectContaining({ status: "delete", path: stalePath })
        ])
      );

      const blockedWrite = await emitDocuments(compiled.rendered, manifest.data, { write: true });
      expect(blockedWrite.success).toBe(false);
      if (blockedWrite.success) {
        return;
      }

      expect(blockedWrite.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["emit.prune_required"]);
      expect(await readFile(workflowPath, "utf8")).toBe("# Manual edit\n");
      expect(await readFile(stalePath, "utf8")).toBe("# stale\n");

      const prunedWrite = requireEmitSuccess(await emitDocuments(compiled.rendered, manifest.data, { write: true, prune: true }));
      expect(prunedWrite.files).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ documentId: "surface_1", status: "update", path: workflowPath }),
          expect.objectContaining({ status: "delete", path: stalePath })
        ])
      );
      expect(await readFile(workflowPath, "utf8")).toBe(compiled.rendered[0]?.markdown);
      await expect(readFile(stalePath, "utf8")).rejects.toMatchObject({ code: "ENOENT" });
    });
  });
});
